<template>
  <div class="container">
    <!-- 3D容器 -->
    <div ref="threeContainer" class="three-container"></div>

    <!-- 控制面板 -->
    <div class="control-panel">
      <select v-model="selectedEra" @change="fetchTechData">
        <option value="all">全部时代</option>
        <option value="pre_qin">先秦</option>
        <option value="han_tang">汉唐</option>
        <option value="song_yuan">宋元</option>
        <option value="ming_qing">明清</option>
        <option value="modern">现代</option>
      </select>

      <div class="tech-list">
        <div
            v-for="tech in techData"
            :key="tech.id"
            class="tech-item"
            @click="loadTechModel(tech)"
            :class="{ active: currentTech?.id === tech.id }"
        >
          {{ tech.name }} ({{ tech.ancient_year }}年)
        </div>
      </div>
    </div>

    <!-- 对比信息面板 -->
    <div v-if="currentTech" class="info-panel">
      <h3>{{ currentTech.name }} 技术演变</h3>
      <div class="comparison">
        <div class="ancient">
          <h4>古代技术 ({{ currentTech.ancient_year }}年)</h4>
          <p>{{ currentTech.ancient_desc }}</p>
        </div>
        <div class="modern">
          <h4>现代技术</h4>
          <p>{{ currentTech.modern_desc }}</p>
        </div>
      </div>
    </div>

    <!-- 加载指示器 -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-spinner"></div>
      <div class="loading-text">模型加载中... {{ loadingProgress }}%</div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'

export default {
  data() {
    return {
      selectedEra: 'all',
      techData: [],
      currentTech: null,
      loading: false,
      loadingProgress: 0,
      // Three.js相关
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      ancientModel: null,
      modernModel: null,
      mixer: null,
      animationFrameId: null
    }
  },
  mounted() {
    this.initThreeJS()
    this.fetchTechData()
    window.addEventListener('resize', this.handleResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    cancelAnimationFrame(this.animationFrameId)
    this.cleanupScene()
  },
  methods: {
    async fetchTechData() {
      try {
        this.loading = true
        const response = await fetch(`/api/tech/?era=${this.selectedEra}`)
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

        const data = await response.json()
        console.log('API响应数据:', data)

        this.techData = data.map(tech => {
          // 确保模型URL格式正确
          const ancientModel = this.ensureAbsoluteUrl(tech.ancient_model)
          const modernModel = this.ensureAbsoluteUrl(tech.modern_model)

          console.log('模型URL:', {ancientModel, modernModel})
          return {...tech, ancient_model: ancientModel, modern_model: modernModel}
        })

        if (this.techData.length > 0) {
          await this.loadTechModel(this.techData[0])
        }
      } catch (error) {
        console.error('获取数据失败:', error)
        this.$message.error('数据加载失败，请刷新重试')
      } finally {
        this.loading = false
      }
    },

    ensureAbsoluteUrl(url) {
      if (!url) return ''
      // 已经是完整URL则直接返回
      if (url.startsWith('http')) return url
      // 处理相对路径
      if (url.startsWith('/')) return `http://localhost:8000${url}`
      // 其他情况返回原始URL
      return url
    },

    initThreeJS() {
      // 初始化场景
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xf0f0f0)

      // 相机
      const container = this.$refs.threeContainer
      this.camera = new THREE.PerspectiveCamera(
          75,
          container.clientWidth / container.clientHeight,
          0.1,
          1000
      )
      this.camera.position.set(0, 3, 10)

      // 渲染器
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true
      })
      this.renderer.setSize(container.clientWidth, container.clientHeight)
      this.renderer.shadowMap.enabled = true
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
      container.appendChild(this.renderer.domElement)

      // 控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.05

      // 灯光
      const ambientLight = new THREE.AmbientLight(0x404040, 2)
      this.scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 10, 7)
      directionalLight.castShadow = true
      directionalLight.shadow.mapSize.width = 1024
      directionalLight.shadow.mapSize.height = 1024
      this.scene.add(directionalLight)

      // 坐标辅助
      const gridHelper = new THREE.GridHelper(10, 10)
      this.scene.add(gridHelper)

      // 开始动画循环
      this.animate()
    },

    async loadTechModel(tech) {
      try {
        this.currentTech = tech
        this.loading = true
        this.loadingProgress = 0

        // 清除旧模型
        this.cleanupModels()

        // 并行加载模型
        await Promise.all([
          this.loadModel(tech.ancient_model, new THREE.Vector3(-3, 0, 0),
              this.loadModel(tech.modern_model, new THREE.Vector3(3, 0, 0)))
        ])
      } catch (error) {
        console.error('模型加载失败:', error)
        this.$message.error('模型加载失败')
      } finally {
        this.loading = false
      }
    },

    loadModel(url, position) {
      return new Promise((resolve, reject) => {
        const loader = new GLTFLoader()

        // 创建加载管理器跟踪进度
        const manager = new THREE.LoadingManager()
        manager.onProgress = (item, loaded, total) => {
          this.loadingProgress = Math.round((loaded / total) * 100)
        }

        loader.manager = manager

        loader.load(
            url,
            (gltf) => {
              const model = gltf.scene
              model.position.copy(position)
              model.scale.set(1, 1, 1)

              // 设置阴影
              model.traverse(child => {
                if (child.isMesh) {
                  child.castShadow = true
                  child.receiveShadow = true
                }
              })

              this.scene.add(model)

              // 保存模型引用
              if (position.x < 0) {
                this.ancientModel = model
              } else {
                this.modernModel = model
              }

              // 处理动画
              if (gltf.animations?.length > 0) {
                if (!this.mixer) {
                  this.mixer = new THREE.AnimationMixer(model)
                }
                const action = this.mixer.clipAction(gltf.animations[0])
                action.play()
              }

              resolve()
            },
            undefined,
            (error) => {
              console.error('模型加载错误:', error)
              this.createPlaceholderModel(position, position.x < 0 ? 0x8b4513 : 0x4682b4)
              reject(error)
            }
        )
      })
    },

    createPlaceholderModel(position, color) {
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.3
      })
      const cube = new THREE.Mesh(geometry, material)
      cube.position.copy(position)
      cube.castShadow = true
      this.scene.add(cube)

      if (position.x < 0) {
        this.ancientModel = cube
      } else {
        this.modernModel = cube
      }
    },

    cleanupModels() {
      if (this.ancientModel) {
        this.scene.remove(this.ancientModel)
        this.ancientModel = null
      }
      if (this.modernModel) {
        this.scene.remove(this.modernModel)
        this.modernModel = null
      }
      if (this.mixer) {
        this.mixer.stopAllAction()
        this.mixer = null
      }
    },

    cleanupScene() {
      this.cleanupModels()
      if (this.renderer) {
        this.renderer.dispose()
        this.renderer = null
      }
    },

    animate() {
      this.animationFrameId = requestAnimationFrame(this.animate)
      if (this.mixer) {
        this.mixer.update(0.016)
      }
      if (this.controls) {
        this.controls.update()
      }
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera)
      }
    },

    handleResize() {
      const container = this.$refs.threeContainer
      if (container && this.camera && this.renderer) {
        this.camera.aspect = container.clientWidth / container.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(container.clientWidth, container.clientHeight)
      }
    }
  }
}
</script>

<style scoped>
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.three-container {
  width: 100%;
  height: 100%;
  background: #f0f0f0;
}

.control-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 70vh;
  overflow-y: auto;
  backdrop-filter: blur(5px);
}

.control-panel select {
  padding: 8px 12px;
  margin-bottom: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  width: 100%;
}

.tech-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 60vh;
  overflow-y: auto;
  padding-right: 5px;
}

.tech-item {
  padding: 8px 12px;
  background: #f5f7fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tech-item:hover {
  background: #e4e7ed;
  transform: translateX(2px);
}

.tech-item.active {
  background: #409eff;
  color: white;
  font-weight: bold;
}

.info-panel {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  backdrop-filter: blur(5px);
}

.comparison {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.comparison h4 {
  margin-top: 0;
  color: #409eff;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
}

.ancient, .modern {
  padding: 10px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 200;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #409eff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.loading-text {
  color: white;
  font-size: 18px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>

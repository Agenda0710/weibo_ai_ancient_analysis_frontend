<template>
  <div class="container">
    <!-- 3D容器 -->
    <div ref="threeContainer" class="three-container"></div>
    <!-- 控制面板 -->
    <div class="control-panel">
      <select v-model="selectedEra" @change="fetchTechData">
        <option value="all">全部时代</option>
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
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';

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
      animationFrameId: null,
    };
  },
  mounted() {
    this.initThreeJS();
    this.fetchTechData();
    window.addEventListener('resize', this.handleResize);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize);
    cancelAnimationFrame(this.animationFrameId);
    this.cleanupScene();
  },
  methods: {
    async fetchTechData() {
      try {
        this.loading = true;
        const response = await fetch(`/api/tech/?era=${this.selectedEra}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log('API响应数据:', data);
        this.techData = data.map((tech) => {
          const ancientModel = this.ensureAbsoluteUrl(tech.ancient_model);
          const modernModel = this.ensureAbsoluteUrl(tech.modern_model);
          console.log('模型URL:', {ancientModel, modernModel});
          return {...tech, ancient_model: ancientModel, modern_model: modernModel};
        });
        if (this.techData.length > 0) {
          await this.loadTechModel(this.techData[0]);
        }
      } catch (error) {
        console.error('获取数据失败:', error);
        this.$message.error('数据加载失败，请刷新重试');
      } finally {
        this.loading = false;
      }
    },
    ensureAbsoluteUrl(url) {
      if (!url) return '';
      if (url.startsWith('http')) return url;
      if (url.startsWith('/')) return `http://localhost:8000${url}`;
      return url;
    },
    initThreeJS() {
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xf0f0f0);

      const container = this.$refs.threeContainer;
      this.camera = new THREE.PerspectiveCamera(
          45,
          container.clientWidth / container.clientHeight,
          0.1,
          1000
      );
      this.camera.position.set(0, 5, 15);

      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      container.appendChild(this.renderer.domElement);

      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 30;
      this.controls.maxPolarAngle = Math.PI * 0.9;

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      this.scene.add(ambientLight);

      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight1.position.set(5, 10, 7);
      directionalLight1.castShadow = true;
      directionalLight1.shadow.mapSize.width = 1024;
      directionalLight1.shadow.mapSize.height = 1024;
      this.scene.add(directionalLight1);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight2.position.set(-5, 5, -7);
      this.scene.add(directionalLight2);

      const gridHelper = new THREE.GridHelper(20, 20);
      this.scene.add(gridHelper);

      this.animate();
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
          this.loadModel(tech.ancient_model, true),
          this.loadModel(tech.modern_model, false)
        ])

        // 统一调整模型位置和比例
        this.positionAndScaleModels()
      } catch (error) {
        console.error('模型加载失败:', error)
        this.$message.error('模型加载失败')
      } finally {
        this.loading = false
      }
    },
    loadModel(url, isAncient) {
      return new Promise((resolve, reject) => {
        if (!url) {
          const position = isAncient ? new THREE.Vector3(-3, 0, 0) : new THREE.Vector3(3, 0, 0)
          this.createPlaceholderModel(position, isAncient ? 0x8b4513 : 0x4682b4)
          resolve()
          return
        }

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

              // 计算模型包围盒
              const box = new THREE.Box3().setFromObject(model)
              const size = box.getSize(new THREE.Vector3())
              const center = box.getCenter(new THREE.Vector3())

              // 自动缩放模型到统一大小
              const maxDimension = Math.max(size.x, size.y, size.z)
              const targetSize = 5 // 我们希望所有模型的最大尺寸都缩放到这个值
              const scale = targetSize / maxDimension

              model.scale.set(scale, scale, scale)

              // 居中模型
              model.position.sub(center.multiplyScalar(scale))

              // 设置阴影
              model.traverse(child => {
                if (child.isMesh) {
                  child.castShadow = true
                  child.receiveShadow = true
                  if (child.material) {
                    child.material.roughness = 0.7
                    child.material.metalness = 0.3
                  }
                }
              })

              this.scene.add(model)

              // 保存模型引用
              if (isAncient) {
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
              const position = isAncient ? new THREE.Vector3(-3, 0, 0) : new THREE.Vector3(3, 0, 0)
              this.createPlaceholderModel(position, isAncient ? 0x8b4513 : 0x4682b4)
              reject(error)
            }
        )
      })
    },

    positionAndScaleModels() {
      // 统一设置模型位置
      if (this.ancientModel) {
        this.ancientModel.position.set(-3, 0, 0)
      }
      if (this.modernModel) {
        this.modernModel.position.set(3, 0, 0)
      }

      // 调整相机视角
      this.fitModelsToView()
    },

    fitModelsToView() {
      // 创建一个包含所有模型的包围盒
      const box = new THREE.Box3()

      if (this.ancientModel) {
        box.expandByObject(this.ancientModel)
      }
      if (this.modernModel) {
        box.expandByObject(this.modernModel)
      }

      if (box.isEmpty()) return

      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())

      // 计算相机距离
      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = this.camera.fov * (Math.PI / 180)
      let cameraDistance = Math.abs(maxDim / Math.sin(fov / 2)) * 1.2

      // 限制最小和最大距离
      cameraDistance = Math.max(5, Math.min(cameraDistance, 30))

      // 更新相机位置
      this.camera.position.copy(center)
      this.camera.position.z += cameraDistance
      this.camera.position.y += cameraDistance * 0.3

      this.controls.target.copy(center)
      this.controls.update()
    },
    createPlaceholderModel(position, color) {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.7,
        metalness: 0.3,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.copy(position);
      cube.castShadow = true;
      this.scene.add(cube);

      if (position.x < 0) {
        this.ancientModel = cube;
      } else {
        this.modernModel = cube;
      }
    },
    cleanupModels() {
      if (this.ancientModel) {
        this.scene.remove(this.ancientModel);
        this.ancientModel = null;
      }
      if (this.modernModel) {
        this.scene.remove(this.modernModel);
        this.modernModel = null;
      }
      if (this.mixer) {
        this.mixer.stopAllAction();
        this.mixer = null;
      }
    },
    cleanupScene() {
      this.cleanupModels();
      if (this.renderer) {
        this.renderer.dispose();
        this.renderer = null;
      }
    },
    animate() {
      this.animationFrameId = requestAnimationFrame(this.animate);
      if (this.mixer) {
        this.mixer.update(0.016);
      }
      if (this.controls) {
        this.controls.update();
      }
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    },
    handleResize() {
      const container = this.$refs.threeContainer;
      if (container && this.camera && this.renderer) {
        this.camera.aspect = container.clientWidth / container.clientHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(container.clientWidth, container.clientHeight);
      }
    },
  },
};
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

.ancient,
.modern {
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

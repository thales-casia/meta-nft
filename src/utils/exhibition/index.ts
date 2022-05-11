import { WebGLRenderer, EventDispatcher, PerspectiveCamera,TextureLoader, Scene, MathUtils, DirectionalLight, AmbientLight, Event, Object3D, MeshPhongMaterial, BackSide, Mesh, CylinderGeometry, Group, SphereGeometry, Material, sRGBEncoding, MeshStandardMaterial, ACESFilmicToneMapping, EquirectangularReflectionMapping, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import { DeviceOrientationControls } from '@/utils/device-orientation-controls';
import TWEEN, { Tween, Easing } from '@tweenjs/tween.js';

/**
 * 版本
 */
export const VER = '1.0';
/**
* 事件
*/
export const EVENT = {
   RUNNING: 'running',
   GAME_INIT: 'gameInit',
   GAME_START: 'gameStart',
   LOADING: 'modelLoaing',
   GAME_OVER: 'gameOver'
};
const Static = {
  X: 0,
  Y: 0,
  WIDTH: 0,
  HEIGHT: 0,
  DURATION: 800,
  CAMERA_FAR: 900
};

export class Exhibition extends EventDispatcher {
  _canvas;
  __camera; // 摄像头
  __scene; // 场景
  __obj; //
  // __bg;//
  __renderer; // 渲染器
  _controls:any = null; // 控制器
  _gyro:any = null; // 陀螺仪
  constructor(canvas:HTMLCanvasElement) {
    super();
    this._canvas = canvas;
    this.onResize();
    this.__scene = new Scene();
    this.__camera = new PerspectiveCamera(75, Static.WIDTH / Static.HEIGHT, 0.01, 100000);
    this.__camera.position.set(0, 0, Static.CAMERA_FAR);
    this.__renderer = new WebGLRenderer({ canvas, antialias: true });
    // this.__bg = this.getBackground();
    this.__obj = new Object3D();
    this.__scene.add( this.getLights(), this.__obj);
    window.addEventListener('resize', this.onResize);
    this.animate(0);
  }
  getBackground() {
    // const geometry = new CylinderGeometry(500, 500, 1000, 50, 1, true);
    // const t = new TextureLoader().load( 'equirectangular.png' );
    // t.mapping = EquirectangularReflectionMapping;
    // this.__scene.background = t;
    // this.__scene.environment = t;
    const geometry = new SphereGeometry(800, 500, 500);
    const texture = new TextureLoader().load( 'equirectangular.png' );
    texture.mapping = EquirectangularReflectionMapping;
    this.__scene.environment = texture;
    const meterial = new MeshPhongMaterial({ color: 0xffffff, map:texture, side: BackSide});
    const mesh = new Mesh(geometry, meterial);
    return mesh;
  }
  getLights() {
    const group = new Group();
    const directionalLight1 = new DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(500, 500, 0);
    const directionalLight2 = new DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(0, 500, 500);
    const directionalLight3 = new DirectionalLight(0xffffff, 1);
    directionalLight3.position.set(0, 500, -500);
    const directionalLight4 = new DirectionalLight(0xffffff, 1);
    directionalLight4.position.set(-500, 500, 0);
    group.add(
      new AmbientLight(0xffffff, 0.4),
      directionalLight1,
      directionalLight2,
      directionalLight3,
      directionalLight4
    );
    return group;
  }
  /**
   * 尺寸重置
   */
  onResize() {
    Static.X = this._canvas.offsetLeft;
    Static.Y = this._canvas.offsetTop;
    Static.WIDTH = this._canvas.clientWidth;
    Static.HEIGHT = this._canvas.clientHeight;
  }
  /**
   * 开始
   */
  start() {
    this.onResize(); // 必须重新定位，否则高度不正确
    this._controls = new OrbitControls(this.__camera, this.__renderer.domElement); // 拖动摄像机
    this._controls.enablePan = false;
    this._controls.addEventListener('end', this.onControlEnd); // 拖动摄像机之后还原
    this._gyro = new DeviceOrientationControls(this.__obj); // 陀螺仪控制物体
  };
  /**
   * 改变模型
   * @param url 模型地址
   */
  changeModel(url:string) {
    this.__obj.clear()
    this.gltf(url);
  }
  /**
   * 改变背景
   * @param url 背景地址
   */
  changeBackground(url:string) {
    new TextureLoader().load( url, texture => {
      texture.mapping = EquirectangularReflectionMapping;
      this.__scene.background = texture;
      this.__scene.environment = texture;
      this.envToModel(texture, this.__obj);
    });
  }
  envToModel(texture:any, obj:any) {
    if(obj.meterial) {
      obj.meterial.envMap = texture;
      obj.meterial.needsUpdate = true;
    }
    if(obj.children.length > 0) {
      this.envToModel(texture, obj.children[0]);
    }
  }
  gltf(url:string) {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      gltf.scene.name = '3dmodel';
      this.__obj.add(gltf.scene);
    }, this.onLoading, this.onLoadErrer);
  }
  fbx(url:string) {
    const loader = new FBXLoader();
    loader.load(url, (obj) => {
      this.__obj.add(obj);
      console.log(obj);
    }, this.onLoading, this.onLoadErrer);
  }
  /**
   * 停止拖动
   * @param e 事件
   */
  onControlEnd = (e:Event) => {
    let position = { // 现在位置
      x: this._controls.object.position.x,
      y: this._controls.object.position.y,
      z: this._controls.object.position.z,
      length: this._controls.object.position.length()
    };
    let aim = { // 目标位置
      x: this._controls.position0.x,
      y: this._controls.position0.y,
      z: this._controls.position0.z,
      length: Static.CAMERA_FAR
    };
    /*
    const a = Math.round(MathUtils.radToDeg(Math.atan2(position.x, position.z)) / 90);
    switch(a) {
      case -1:
        aim.x = Static.CAMERA_FAR;
        aim.z = 0;
        break;
      case 1:
        aim.x = -Static.CAMERA_FAR;
        aim.z = 0;
        break;
      case 2:
        aim.x = 0
        aim.z = -Static.CAMERA_FAR;
        break;
      case 0:
      default:
        aim.x = 0
        aim.z = Static.CAMERA_FAR;
        break;
    }
    */
    const t = new Tween(position).to(aim, Static.DURATION).easing(Easing.Quadratic.In);
    t.onUpdate((e) => {
      const v = new Vector3(e.x, e.y, e.z);
      v.setLength(e.length)
      this._controls.object.position.set(v.x, v.y, v.z);
      this._controls.object.lookAt(this._controls.target);
    });
    t.start();
  }
  /**
   * 模型加载中
   * @param e 事件
   */
  onLoading = (e:Event) => {
    console.log(e);
    const event = { type: EVENT.LOADING, data: e };
    this.dispatchEvent(event);
  }
  /**
   * 模型加载错误
   * @param e 事件
   */
  onLoadErrer = (e:Event) => {
    console.error(e);
  }
  animate = (time:number)=> {
    requestAnimationFrame(this.animate);
    TWEEN.update(time);
    this.__renderer.render(this.__scene, this.__camera);
  }
}


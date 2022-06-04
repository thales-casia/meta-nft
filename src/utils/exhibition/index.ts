import { WebGLRenderer, EventDispatcher, PerspectiveCamera,TextureLoader, Scene, MathUtils, DirectionalLight, AmbientLight, Event, Object3D, MeshPhongMaterial, BackSide, Mesh, CylinderGeometry, Group, SphereGeometry, Material, sRGBEncoding, MeshStandardMaterial, ACESFilmicToneMapping, EquirectangularReflectionMapping, Vector3, PointLight, MeshBasicMaterial, RepeatWrapping, MirroredRepeatWrapping } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
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
   LOADING: 'modelLoading',
   LOADED: 'modelLoaded',
   LOAD_FAIL: 'modelLoadFail',
   GAME_OVER: 'gameOver'
};
const Static = {
  X: 0,
  Y: 0,
  WIDTH: 0,
  HEIGHT: 0,
  DURATION: 1600,
  CAMERA_FAR: 9
};

export class Exhibition extends EventDispatcher {
  _canvas;
  __camera; // 摄像头
  __scene; // 场景
  __obj; //
  // __bg;//
  __renderer; // 渲染器
  _loader:any = null; // 加载器
  _controls:any = null; // 控制器
  _gyro:any = null; // 陀螺仪
  ORIGINS = [
    new Vector3(0, 0, 9),
    new Vector3(0, 0, -9)
  ];

  constructor(canvas:HTMLCanvasElement) {
    super();
    this._canvas = canvas;
    this.onResize();
    this.__scene = new Scene();
    this.__camera = new PerspectiveCamera(75, Static.WIDTH / Static.HEIGHT, 0.01, 10000);
    this.__camera.position.set(0, 0, Static.CAMERA_FAR);
    this.__renderer = new WebGLRenderer({ canvas, antialias: true });
    this.__obj = new Object3D();
    this.loaderInit();
    this.__scene.add(
      // this.getLights(),
      this.getBackground(),
      this.__obj);
    window.addEventListener('resize', this.onResize);
    this.animate(0);
  }
  getLights() {
    const group = new Group();
    // const directionalLight1 = new DirectionalLight(0xffffff, 1);
    // directionalLight1.position.set(5, 5, 0);
    // const directionalLight2 = new DirectionalLight(0xffffff, 1);
    // directionalLight2.position.set(0, 5, 5);
    // const directionalLight3 = new DirectionalLight(0xffffff, 1);
    // directionalLight3.position.set(0, 5, -5);
    // const directionalLight4 = new DirectionalLight(0xffffff, 1);
    // directionalLight4.position.set(-5, 5, 0);
    const light0 = new PointLight(0xffffff, 0.6);
    light0.position.set(0, 9, 0);
    const light1 = new PointLight(0xffffff, 0.6);
    light1.position.set(0, -9, 0);
    const light2 = new PointLight(0xffffff, 0.6);
    light2.position.set(12, 0, 0);
    const light3 = new PointLight(0xffffff, 0.6);
    light3.position.set(-12, 0, 0);
    const light4 = new PointLight(0xffffff, 0.6);
    light4.position.set(0, 0, 9);
    const light5 = new PointLight(0xffffff, 0.6);
    light5.position.set(0, 0, -9);
    group.add(
      // new AmbientLight(0xffffff, 1),
      // light0,
      // light1,
      // light2,
      // light3,
      // light4,
      // light5,
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
    // this._controls = new TrackballControls(this.__camera, this.__renderer.domElement); // 拖动摄像机
    // this._controls.rotateSpeed = 1.0;
    // this._controls.zoomSpeed = 1.2;
    // this._controls.noPan = true;
    this._controls.maxDistance = 60;
    this._controls.zoomSpeed = 0.3;
    // this._controls.panSpeed = 0.8;
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
    this._loader.load(url, (gltf:any) => {
      gltf.scene.name = '3dmodel';
      this.__obj.add(gltf.scene);
      const event = { type: EVENT.LOADED, data: gltf };
      this.dispatchEvent(event);  
    }, this.onLoading, this.onLoadErrer);
  }
  getBackground() {
    const group = new Group();
    const background = new Mesh(
      new SphereGeometry(100,100,100),
      new MeshBasicMaterial({
        side:BackSide,
        map:new TextureLoader().load( './backgrounds/background.jpg')
      })
    );

    // const texture = new TextureLoader().load( './backgrounds/star.jpg');
    // texture.wrapS = MirroredRepeatWrapping;
    // texture.wrapT = MirroredRepeatWrapping;
    // texture.repeat.set( 4, 4 );
    const star = new Mesh(
      new SphereGeometry(80,100,100),
      new MeshBasicMaterial({
        side:BackSide,
        transparent:true,
        map: new TextureLoader().load( './backgrounds/star.png')
      })
    );
    const nebula = new Mesh(
      new SphereGeometry(60,100,100),
      new MeshBasicMaterial({
        side:BackSide,
        transparent:true,
        map:new TextureLoader().load( './backgrounds/nebula.png')
      })
    );
    group.add(
      background,
      star,
      nebula
    );
    return group;
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
  loaderInit() {
    const dracoLoader =new DRACOLoader();
    this._loader = new GLTFLoader();
    dracoLoader.setDecoderPath('./gltfdraco/');
    dracoLoader.setDecoderConfig({ type:'js'});
    dracoLoader.preload();
    this._loader.setDRACOLoader(dracoLoader);
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
    };
    // let aim = { // 目标位置
    //   x: this._controls.position0.x,
    //   y: this._controls.position0.y,
    //   z: this._controls.position0.z,
    // };
    let originIndex = 0;
    let minDistance = Infinity;
    for(const k in this.ORIGINS) {
      const distance = this.ORIGINS[k].distanceTo(this._controls.object.position);
      if(distance < minDistance) {
        minDistance = distance;
        originIndex = parseInt(k);
      }
    }
    let aim = this.ORIGINS[originIndex];
    const t = new Tween(position).to(aim, Static.DURATION).easing(Easing.Quadratic.In);
    t.onUpdate((e) => {
      const v = new Vector3(e.x, e.y, e.z);
      v.setLength(this._controls.object.position.length());
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
    const event = { type: EVENT.LOADING, data: e };
    this.dispatchEvent(event);
  }
  /**
   * 模型加载错误
   * @param e 事件
   */
  onLoadErrer = (e:Event) => {
    const event = { type: EVENT.LOAD_FAIL, data: e };
    this.dispatchEvent(event);
  }
  animate = (time:number)=> {
    requestAnimationFrame(this.animate);
    // if(this._controls) this._controls.update();
    TWEEN.update(time);
    this.__renderer.render(this.__scene, this.__camera);
  }
}


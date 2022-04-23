import { WebGLRenderer, EventDispatcher, PerspectiveCamera,TextureLoader, Scene, Color, DirectionalLight, AmbientLight, Event, Object3D, MeshPhongMaterial, BackSide, Mesh, SphereGeometry, Group } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import { DeviceOrientationControls } from '@/utils/device-orientation-controls';

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
  CAMERA_FAR: 60
};

export class Exhibition extends EventDispatcher {
  _canvas;
  __camera; // 摄像头
  __scene; // 场景
  __obj; //
  __renderer; // 渲染器
  _controls:any = null;
  constructor(canvas:HTMLCanvasElement) {
    super();
    this._canvas = canvas;
    this.onResize();
    this.__scene = new Scene();
    this.__camera = new PerspectiveCamera(75, Static.WIDTH / Static.HEIGHT, 0.01, 100000);
    this.__camera.position.set(0, 10, Static.CAMERA_FAR);
    this.__renderer = new WebGLRenderer({ canvas, antialias: true });
    this.__obj = new Object3D();
    this.__scene.add( this.getBackground(), this.getLights(), this.__obj);
    window.addEventListener('resize', this.onResize);
    this.animate(0);
  }
  getBackground() {
    const geometry = new SphereGeometry(80, 50, 50);
    const texture = new TextureLoader().load( 'equirectangular.png' );
    const meterial = new MeshPhongMaterial({ color: 0xffff00, map:texture, side: BackSide});
    const mesh = new Mesh(geometry, meterial);
    return mesh;
  }
  getLights() {
    const group = new Group();
    const directionalLight1 = new DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(50, 50, 0);
    const directionalLight2 = new DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(0, 50, 50);
    const directionalLight3 = new DirectionalLight(0xffffff, 1);
    directionalLight3.position.set(0, 50, -50);
    const directionalLight4 = new DirectionalLight(0xffffff, 1);
    directionalLight4.position.set(-50, 50, 0);
    group.add(
      // new AmbientLight(0xffffff, 0.4),
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
   * @param {int} url 地址
   */
  start(url:string) {
    this.onResize(); // 必须重新定位，否则高度不正确
    this.fbx(url);
    // const controls = new OrbitControls(this.__camera, this.__renderer.domElement);
    this._controls = new DeviceOrientationControls(this.__obj);
    this._controls.connect();
  };
  gltf(url:string) {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      gltf.scene.name = '3dmodel';
      // this.__scene.add(gltf.scene);
      this.__obj.add(gltf.scene);
      console.log(gltf);
    }, this.onLoading, this.onLoadErrer);
  }
  fbx(url:string) {
    const loader = new FBXLoader();
    loader.load(url, (obj) => {
      this.__obj.add(obj);
      console.log(obj);
    }, this.onLoading, this.onLoadErrer);
  }
  onLoading = (e:Event) => {
    console.log(e);
    const event = { type: EVENT.LOADING, data: e };
    this.dispatchEvent(event);
  }
  onLoadErrer = (e:Event) => {
    console.error(e);
  }
  animate = (time:number)=> {
    requestAnimationFrame(this.animate);
    if(this._controls) this._controls.update();
    this.__renderer.render(this.__scene, this.__camera);
  }
}


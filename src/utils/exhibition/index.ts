import { WebGLRenderer, EventDispatcher, PerspectiveCamera, Scene, Color, DirectionalLight, AmbientLight, Event } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';

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

export class Exhibition {
  _canvas;
  __camera; // 摄像头
  __scene; // 场景
  __renderer; // 渲染器
  constructor(canvas:HTMLCanvasElement) {
    this._canvas = canvas;
    this.onResize();
    this.__scene = new Scene();
    this.__scene.background = new Color('skyblue');
    this.__camera = new PerspectiveCamera(75, Static.WIDTH / Static.HEIGHT, 0.01, 100000);
    this.__camera.position.set(0, 10, Static.CAMERA_FAR);
    this.__renderer = new WebGLRenderer({ canvas, antialias: true });
    const directionalLight = new DirectionalLight(0xffffff, 100);
    directionalLight.position.set(1, 100, 0).normalize();
    const ambientLight = new AmbientLight(0xffffff);
    this.__scene.add(directionalLight, ambientLight);
    window.addEventListener('resize', this.onResize);
    this.animate(0);
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
    const controls = new OrbitControls(this.__camera, this.__renderer.domElement);
    controls.update();
  };
  gltf(url:string) {
    const loader = new GLTFLoader();
    loader.load(url, (gltf) => {
      gltf.scene.name = '3dmodel';
      // this.__scene.add(gltf.scene);
      this.__scene.add(gltf.scene);
      console.log(gltf);
    }, this.onLoading, this.onLoadErrer);
  }
  fbx(url:string) {
    const loader = new FBXLoader();
    loader.load(url, (obj) => {
      this.__scene.add(obj);
      console.log(obj);
    }, this.onLoading, this.onLoadErrer);
  }
  onLoading = (e:Event) => {
    console.log(e);
    const event = { type: EVENT.LOADING, data: e };
    // _this.dispatchEvent(event); // 走棋
  }
  onLoadErrer = (e:Event) => {
    console.error(e);
  }
  animate = (time:number)=> {
    requestAnimationFrame(this.animate);
    this.__renderer.render(this.__scene, this.__camera);
  }
}


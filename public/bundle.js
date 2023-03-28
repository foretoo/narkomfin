import { EventDispatcher as _t, Vector3 as O, MOUSE as q, TOUCH as Z, Quaternion as ae, Spherical as ve, Vector2 as I, TrianglesDrawMode as Mt, TriangleFanDrawMode as be, TriangleStripDrawMode as Je, Loader as $e, LoaderUtils as Ae, FileLoader as ce, Color as B, SpotLight as St, PointLight as Nt, DirectionalLight as et, MeshBasicMaterial as ne, sRGBEncoding as J, MeshPhysicalMaterial as X, Matrix4 as le, InstancedMesh as It, Object3D as tt, TextureLoader as Ot, ImageBitmapLoader as Pt, BufferAttribute as se, InterleavedBuffer as Dt, InterleavedBufferAttribute as kt, LinearFilter as nt, LinearMipmapLinearFilter as st, RepeatWrapping as Re, PointsMaterial as Ct, Material as pe, LineBasicMaterial as Ft, MeshStandardMaterial as z, DoubleSide as Ht, PropertyBinding as Ut, BufferGeometry as ot, SkinnedMesh as jt, Mesh as rt, LineSegments as Gt, Line as vt, LineLoop as Kt, Points as Bt, Group as ie, PerspectiveCamera as xe, MathUtils as Vt, OrthographicCamera as zt, Skeleton as Xt, InterpolateLinear as it, AnimationClip as Yt, Bone as Wt, NearestFilter as qt, NearestMipmapNearestFilter as Zt, LinearMipmapNearestFilter as Qt, NearestMipmapLinearFilter as Jt, ClampToEdgeWrapping as $t, MirroredRepeatWrapping as en, InterpolateDiscrete as tn, FrontSide as nn, Texture as Ke, VectorKeyframeTrack as sn, QuaternionKeyframeTrack as Be, NumberKeyframeTrack as on, Box3 as rn, Sphere as an, Interpolant as cn, LoadingManager as ln, Scene as un, WebGLRenderer as dn, ACESFilmicToneMapping as hn, PCFSoftShadowMap as fn, HemisphereLight as pn } from "https://cdnjs.cloudflare.com/ajax/libs/three.js/0.149.0/three.module.min.js";
const Ve = { type: "change" }, me = { type: "start" }, ze = { type: "end" };
class mn extends _t {
  constructor(n, t) {
    super(), this.object = n, this.domElement = t, this.domElement.style.touchAction = "none", this.enabled = !0, this.target = new O(), this.minDistance = 0, this.maxDistance = 1 / 0, this.minZoom = 0, this.maxZoom = 1 / 0, this.minPolarAngle = 0, this.maxPolarAngle = Math.PI, this.minAzimuthAngle = -1 / 0, this.maxAzimuthAngle = 1 / 0, this.enableDamping = !1, this.dampingFactor = 0.05, this.enableZoom = !0, this.zoomSpeed = 1, this.enableRotate = !0, this.rotateSpeed = 1, this.enablePan = !0, this.panSpeed = 1, this.screenSpacePanning = !0, this.keyPanSpeed = 7, this.autoRotate = !1, this.autoRotateSpeed = 2, this.keys = { LEFT: "ArrowLeft", UP: "ArrowUp", RIGHT: "ArrowRight", BOTTOM: "ArrowDown" }, this.mouseButtons = { LEFT: q.ROTATE, MIDDLE: q.DOLLY, RIGHT: q.PAN }, this.touches = { ONE: Z.ROTATE, TWO: Z.DOLLY_PAN }, this.target0 = this.target.clone(), this.position0 = this.object.position.clone(), this.zoom0 = this.object.zoom, this._domElementKeyEvents = null, this.getPolarAngle = function() {
      return a.phi;
    }, this.getAzimuthalAngle = function() {
      return a.theta;
    }, this.getDistance = function() {
      return this.object.position.distanceTo(this.target);
    }, this.listenToKeyEvents = function(u) {
      u.addEventListener("keydown", Fe), this._domElementKeyEvents = u;
    }, this.saveState = function() {
      e.target0.copy(e.target), e.position0.copy(e.object.position), e.zoom0 = e.object.zoom;
    }, this.reset = function() {
      e.target.copy(e.target0), e.object.position.copy(e.position0), e.object.zoom = e.zoom0, e.object.updateProjectionMatrix(), e.dispatchEvent(Ve), e.update(), o = s.NONE;
    }, this.update = function() {
      const u = new O(), y = new ae().setFromUnitVectors(n.up, new O(0, 1, 0)), x = y.clone().invert(), M = new O(), F = new ae(), W = 2 * Math.PI;
      return function() {
        const Ge = e.object.position;
        u.copy(Ge).sub(e.target), u.applyQuaternion(y), a.setFromVector3(u), e.autoRotate && o === s.NONE && D(N()), e.enableDamping ? (a.theta += i.theta * e.dampingFactor, a.phi += i.phi * e.dampingFactor) : (a.theta += i.theta, a.phi += i.phi);
        let U = e.minAzimuthAngle, j = e.maxAzimuthAngle;
        return isFinite(U) && isFinite(j) && (U < -Math.PI ? U += W : U > Math.PI && (U -= W), j < -Math.PI ? j += W : j > Math.PI && (j -= W), U <= j ? a.theta = Math.max(U, Math.min(j, a.theta)) : a.theta = a.theta > (U + j) / 2 ? Math.max(U, a.theta) : Math.min(j, a.theta)), a.phi = Math.max(e.minPolarAngle, Math.min(e.maxPolarAngle, a.phi)), a.makeSafe(), a.radius *= c, a.radius = Math.max(e.minDistance, Math.min(e.maxDistance, a.radius)), e.enableDamping === !0 ? e.target.addScaledVector(h, e.dampingFactor) : e.target.add(h), u.setFromSpherical(a), u.applyQuaternion(x), Ge.copy(e.target).add(u), e.object.lookAt(e.target), e.enableDamping === !0 ? (i.theta *= 1 - e.dampingFactor, i.phi *= 1 - e.dampingFactor, h.multiplyScalar(1 - e.dampingFactor)) : (i.set(0, 0, 0), h.set(0, 0, 0)), c = 1, l || M.distanceToSquared(e.object.position) > r || 8 * (1 - F.dot(e.object.quaternion)) > r ? (e.dispatchEvent(Ve), M.copy(e.object.position), F.copy(e.object.quaternion), l = !1, !0) : !1;
      };
    }(), this.dispose = function() {
      e.domElement.removeEventListener("contextmenu", He), e.domElement.removeEventListener("pointerdown", De), e.domElement.removeEventListener("pointercancel", ke), e.domElement.removeEventListener("wheel", Ce), e.domElement.removeEventListener("pointermove", de), e.domElement.removeEventListener("pointerup", he), e._domElementKeyEvents !== null && e._domElementKeyEvents.removeEventListener("keydown", Fe);
    };
    const e = this, s = {
      NONE: -1,
      ROTATE: 0,
      DOLLY: 1,
      PAN: 2,
      TOUCH_ROTATE: 3,
      TOUCH_PAN: 4,
      TOUCH_DOLLY_PAN: 5,
      TOUCH_DOLLY_ROTATE: 6
    };
    let o = s.NONE;
    const r = 1e-6, a = new ve(), i = new ve();
    let c = 1;
    const h = new O();
    let l = !1;
    const d = new I(), p = new I(), g = new I(), E = new I(), m = new I(), T = new I(), w = new I(), A = new I(), L = new I(), b = [], S = {};
    function N() {
      return 2 * Math.PI / 60 / 60 * e.autoRotateSpeed;
    }
    function P() {
      return Math.pow(0.95, e.zoomSpeed);
    }
    function D(u) {
      i.theta -= u;
    }
    function Y(u) {
      i.phi -= u;
    }
    const V = function() {
      const u = new O();
      return function(x, M) {
        u.setFromMatrixColumn(M, 0), u.multiplyScalar(-x), h.add(u);
      };
    }(), H = function() {
      const u = new O();
      return function(x, M) {
        e.screenSpacePanning === !0 ? u.setFromMatrixColumn(M, 1) : (u.setFromMatrixColumn(M, 0), u.crossVectors(e.object.up, u)), u.multiplyScalar(x), h.add(u);
      };
    }(), _ = function() {
      const u = new O();
      return function(x, M) {
        const F = e.domElement;
        if (e.object.isPerspectiveCamera) {
          const W = e.object.position;
          u.copy(W).sub(e.target);
          let re = u.length();
          re *= Math.tan(e.object.fov / 2 * Math.PI / 180), V(2 * x * re / F.clientHeight, e.object.matrix), H(2 * M * re / F.clientHeight, e.object.matrix);
        } else
          e.object.isOrthographicCamera ? (V(x * (e.object.right - e.object.left) / e.object.zoom / F.clientWidth, e.object.matrix), H(M * (e.object.top - e.object.bottom) / e.object.zoom / F.clientHeight, e.object.matrix)) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."), e.enablePan = !1);
      };
    }();
    function G(u) {
      e.object.isPerspectiveCamera ? c /= u : e.object.isOrthographicCamera ? (e.object.zoom = Math.max(e.minZoom, Math.min(e.maxZoom, e.object.zoom * u)), e.object.updateProjectionMatrix(), l = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), e.enableZoom = !1);
    }
    function C(u) {
      e.object.isPerspectiveCamera ? c *= u : e.object.isOrthographicCamera ? (e.object.zoom = Math.max(e.minZoom, Math.min(e.maxZoom, e.object.zoom / u)), e.object.updateProjectionMatrix(), l = !0) : (console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."), e.enableZoom = !1);
    }
    function $(u) {
      d.set(u.clientX, u.clientY);
    }
    function ue(u) {
      w.set(u.clientX, u.clientY);
    }
    function oe(u) {
      E.set(u.clientX, u.clientY);
    }
    function ht(u) {
      p.set(u.clientX, u.clientY), g.subVectors(p, d).multiplyScalar(e.rotateSpeed);
      const y = e.domElement;
      D(2 * Math.PI * g.x / y.clientHeight), Y(2 * Math.PI * g.y / y.clientHeight), d.copy(p), e.update();
    }
    function ft(u) {
      A.set(u.clientX, u.clientY), L.subVectors(A, w), L.y > 0 ? G(P()) : L.y < 0 && C(P()), w.copy(A), e.update();
    }
    function pt(u) {
      m.set(u.clientX, u.clientY), T.subVectors(m, E).multiplyScalar(e.panSpeed), _(T.x, T.y), E.copy(m), e.update();
    }
    function mt(u) {
      u.deltaY < 0 ? C(P()) : u.deltaY > 0 && G(P()), e.update();
    }
    function gt(u) {
      let y = !1;
      switch (u.code) {
        case e.keys.UP:
          u.ctrlKey || u.metaKey || u.shiftKey ? Y(2 * Math.PI * e.rotateSpeed / e.domElement.clientHeight) : _(0, e.keyPanSpeed), y = !0;
          break;
        case e.keys.BOTTOM:
          u.ctrlKey || u.metaKey || u.shiftKey ? Y(-2 * Math.PI * e.rotateSpeed / e.domElement.clientHeight) : _(0, -e.keyPanSpeed), y = !0;
          break;
        case e.keys.LEFT:
          u.ctrlKey || u.metaKey || u.shiftKey ? D(2 * Math.PI * e.rotateSpeed / e.domElement.clientHeight) : _(e.keyPanSpeed, 0), y = !0;
          break;
        case e.keys.RIGHT:
          u.ctrlKey || u.metaKey || u.shiftKey ? D(-2 * Math.PI * e.rotateSpeed / e.domElement.clientHeight) : _(-e.keyPanSpeed, 0), y = !0;
          break;
      }
      y && (u.preventDefault(), e.update());
    }
    function Me() {
      if (b.length === 1)
        d.set(b[0].pageX, b[0].pageY);
      else {
        const u = 0.5 * (b[0].pageX + b[1].pageX), y = 0.5 * (b[0].pageY + b[1].pageY);
        d.set(u, y);
      }
    }
    function Se() {
      if (b.length === 1)
        E.set(b[0].pageX, b[0].pageY);
      else {
        const u = 0.5 * (b[0].pageX + b[1].pageX), y = 0.5 * (b[0].pageY + b[1].pageY);
        E.set(u, y);
      }
    }
    function Ne() {
      const u = b[0].pageX - b[1].pageX, y = b[0].pageY - b[1].pageY, x = Math.sqrt(u * u + y * y);
      w.set(0, x);
    }
    function Tt() {
      e.enableZoom && Ne(), e.enablePan && Se();
    }
    function yt() {
      e.enableZoom && Ne(), e.enableRotate && Me();
    }
    function Ie(u) {
      if (b.length == 1)
        p.set(u.pageX, u.pageY);
      else {
        const x = fe(u), M = 0.5 * (u.pageX + x.x), F = 0.5 * (u.pageY + x.y);
        p.set(M, F);
      }
      g.subVectors(p, d).multiplyScalar(e.rotateSpeed);
      const y = e.domElement;
      D(2 * Math.PI * g.x / y.clientHeight), Y(2 * Math.PI * g.y / y.clientHeight), d.copy(p);
    }
    function Oe(u) {
      if (b.length === 1)
        m.set(u.pageX, u.pageY);
      else {
        const y = fe(u), x = 0.5 * (u.pageX + y.x), M = 0.5 * (u.pageY + y.y);
        m.set(x, M);
      }
      T.subVectors(m, E).multiplyScalar(e.panSpeed), _(T.x, T.y), E.copy(m);
    }
    function Pe(u) {
      const y = fe(u), x = u.pageX - y.x, M = u.pageY - y.y, F = Math.sqrt(x * x + M * M);
      A.set(0, F), L.set(0, Math.pow(A.y / w.y, e.zoomSpeed)), G(L.y), w.copy(A);
    }
    function Et(u) {
      e.enableZoom && Pe(u), e.enablePan && Oe(u);
    }
    function bt(u) {
      e.enableZoom && Pe(u), e.enableRotate && Ie(u);
    }
    function De(u) {
      e.enabled !== !1 && (b.length === 0 && (e.domElement.setPointerCapture(u.pointerId), e.domElement.addEventListener("pointermove", de), e.domElement.addEventListener("pointerup", he)), xt(u), u.pointerType === "touch" ? wt(u) : At(u));
    }
    function de(u) {
      e.enabled !== !1 && (u.pointerType === "touch" ? Lt(u) : Rt(u));
    }
    function he(u) {
      Ue(u), b.length === 0 && (e.domElement.releasePointerCapture(u.pointerId), e.domElement.removeEventListener("pointermove", de), e.domElement.removeEventListener("pointerup", he)), e.dispatchEvent(ze), o = s.NONE;
    }
    function ke(u) {
      Ue(u);
    }
    function At(u) {
      let y;
      switch (u.button) {
        case 0:
          y = e.mouseButtons.LEFT;
          break;
        case 1:
          y = e.mouseButtons.MIDDLE;
          break;
        case 2:
          y = e.mouseButtons.RIGHT;
          break;
        default:
          y = -1;
      }
      switch (y) {
        case q.DOLLY:
          if (e.enableZoom === !1)
            return;
          ue(u), o = s.DOLLY;
          break;
        case q.ROTATE:
          if (u.ctrlKey || u.metaKey || u.shiftKey) {
            if (e.enablePan === !1)
              return;
            oe(u), o = s.PAN;
          } else {
            if (e.enableRotate === !1)
              return;
            $(u), o = s.ROTATE;
          }
          break;
        case q.PAN:
          if (u.ctrlKey || u.metaKey || u.shiftKey) {
            if (e.enableRotate === !1)
              return;
            $(u), o = s.ROTATE;
          } else {
            if (e.enablePan === !1)
              return;
            oe(u), o = s.PAN;
          }
          break;
        default:
          o = s.NONE;
      }
      o !== s.NONE && e.dispatchEvent(me);
    }
    function Rt(u) {
      switch (o) {
        case s.ROTATE:
          if (e.enableRotate === !1)
            return;
          ht(u);
          break;
        case s.DOLLY:
          if (e.enableZoom === !1)
            return;
          ft(u);
          break;
        case s.PAN:
          if (e.enablePan === !1)
            return;
          pt(u);
          break;
      }
    }
    function Ce(u) {
      e.enabled === !1 || e.enableZoom === !1 || o !== s.NONE || (u.preventDefault(), e.dispatchEvent(me), mt(u), e.dispatchEvent(ze));
    }
    function Fe(u) {
      e.enabled === !1 || e.enablePan === !1 || gt(u);
    }
    function wt(u) {
      switch (je(u), b.length) {
        case 1:
          switch (e.touches.ONE) {
            case Z.ROTATE:
              if (e.enableRotate === !1)
                return;
              Me(), o = s.TOUCH_ROTATE;
              break;
            case Z.PAN:
              if (e.enablePan === !1)
                return;
              Se(), o = s.TOUCH_PAN;
              break;
            default:
              o = s.NONE;
          }
          break;
        case 2:
          switch (e.touches.TWO) {
            case Z.DOLLY_PAN:
              if (e.enableZoom === !1 && e.enablePan === !1)
                return;
              Tt(), o = s.TOUCH_DOLLY_PAN;
              break;
            case Z.DOLLY_ROTATE:
              if (e.enableZoom === !1 && e.enableRotate === !1)
                return;
              yt(), o = s.TOUCH_DOLLY_ROTATE;
              break;
            default:
              o = s.NONE;
          }
          break;
        default:
          o = s.NONE;
      }
      o !== s.NONE && e.dispatchEvent(me);
    }
    function Lt(u) {
      switch (je(u), o) {
        case s.TOUCH_ROTATE:
          if (e.enableRotate === !1)
            return;
          Ie(u), e.update();
          break;
        case s.TOUCH_PAN:
          if (e.enablePan === !1)
            return;
          Oe(u), e.update();
          break;
        case s.TOUCH_DOLLY_PAN:
          if (e.enableZoom === !1 && e.enablePan === !1)
            return;
          Et(u), e.update();
          break;
        case s.TOUCH_DOLLY_ROTATE:
          if (e.enableZoom === !1 && e.enableRotate === !1)
            return;
          bt(u), e.update();
          break;
        default:
          o = s.NONE;
      }
    }
    function He(u) {
      e.enabled !== !1 && u.preventDefault();
    }
    function xt(u) {
      b.push(u);
    }
    function Ue(u) {
      delete S[u.pointerId];
      for (let y = 0; y < b.length; y++)
        if (b[y].pointerId == u.pointerId) {
          b.splice(y, 1);
          return;
        }
    }
    function je(u) {
      let y = S[u.pointerId];
      y === void 0 && (y = new I(), S[u.pointerId] = y), y.set(u.pageX, u.pageY);
    }
    function fe(u) {
      const y = u.pointerId === b[0].pointerId ? b[1] : b[0];
      return S[y.pointerId];
    }
    e.domElement.addEventListener("contextmenu", He), e.domElement.addEventListener("pointerdown", De), e.domElement.addEventListener("pointercancel", ke), e.domElement.addEventListener("wheel", Ce, { passive: !1 }), this.update();
  }
}
const ge = {
  LOADING: "Loading model",
  DECODING: "Preparing a scene",
  ERROR: "Error"
}, gn = 1134066, Tn = getComputedStyle(document.body).backgroundColor;
function Xe(f, n) {
  if (n === Mt)
    return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), f;
  if (n === be || n === Je) {
    let t = f.getIndex();
    if (t === null) {
      const r = [], a = f.getAttribute("position");
      if (a !== void 0) {
        for (let i = 0; i < a.count; i++)
          r.push(i);
        f.setIndex(r), t = f.getIndex();
      } else
        return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), f;
    }
    const e = t.count - 2, s = [];
    if (n === be)
      for (let r = 1; r <= e; r++)
        s.push(t.getX(0)), s.push(t.getX(r)), s.push(t.getX(r + 1));
    else
      for (let r = 0; r < e; r++)
        r % 2 === 0 ? (s.push(t.getX(r)), s.push(t.getX(r + 1)), s.push(t.getX(r + 2))) : (s.push(t.getX(r + 2)), s.push(t.getX(r + 1)), s.push(t.getX(r)));
    s.length / 3 !== e && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");
    const o = f.clone();
    return o.setIndex(s), o.clearGroups(), o;
  } else
    return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", n), f;
}
class yn extends $e {
  constructor(n) {
    super(n), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(t) {
      return new wn(t);
    }), this.register(function(t) {
      return new In(t);
    }), this.register(function(t) {
      return new On(t);
    }), this.register(function(t) {
      return new xn(t);
    }), this.register(function(t) {
      return new _n(t);
    }), this.register(function(t) {
      return new Mn(t);
    }), this.register(function(t) {
      return new Sn(t);
    }), this.register(function(t) {
      return new Rn(t);
    }), this.register(function(t) {
      return new Nn(t);
    }), this.register(function(t) {
      return new Ln(t);
    }), this.register(function(t) {
      return new bn(t);
    }), this.register(function(t) {
      return new Pn(t);
    }), this.register(function(t) {
      return new Dn(t);
    });
  }
  load(n, t, e, s) {
    const o = this;
    let r;
    this.resourcePath !== "" ? r = this.resourcePath : this.path !== "" ? r = this.path : r = Ae.extractUrlBase(n), this.manager.itemStart(n);
    const a = function(c) {
      s ? s(c) : console.error(c), o.manager.itemError(n), o.manager.itemEnd(n);
    }, i = new ce(this.manager);
    i.setPath(this.path), i.setResponseType("arraybuffer"), i.setRequestHeader(this.requestHeader), i.setWithCredentials(this.withCredentials), i.load(n, function(c) {
      try {
        o.parse(c, r, function(h) {
          t(h), o.manager.itemEnd(n);
        }, a);
      } catch (h) {
        a(h);
      }
    }, e, a);
  }
  setDRACOLoader(n) {
    return this.dracoLoader = n, this;
  }
  setDDSLoader() {
    throw new Error(
      'THREE.GLTFLoader: "MSFT_texture_dds" no longer supported. Please update to "KHR_texture_basisu".'
    );
  }
  setKTX2Loader(n) {
    return this.ktx2Loader = n, this;
  }
  setMeshoptDecoder(n) {
    return this.meshoptDecoder = n, this;
  }
  register(n) {
    return this.pluginCallbacks.indexOf(n) === -1 && this.pluginCallbacks.push(n), this;
  }
  unregister(n) {
    return this.pluginCallbacks.indexOf(n) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(n), 1), this;
  }
  parse(n, t, e, s) {
    let o;
    const r = {}, a = {}, i = new TextDecoder();
    if (typeof n == "string")
      o = JSON.parse(n);
    else if (n instanceof ArrayBuffer)
      if (i.decode(new Uint8Array(n, 0, 4)) === at) {
        try {
          r[R.KHR_BINARY_GLTF] = new kn(n);
        } catch (l) {
          s && s(l);
          return;
        }
        o = JSON.parse(r[R.KHR_BINARY_GLTF].content);
      } else
        o = JSON.parse(i.decode(n));
    else
      o = n;
    if (o.asset === void 0 || o.asset.version[0] < 2) {
      s && s(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
      return;
    }
    const c = new Yn(o, {
      path: t || this.resourcePath || "",
      crossOrigin: this.crossOrigin,
      requestHeader: this.requestHeader,
      manager: this.manager,
      ktx2Loader: this.ktx2Loader,
      meshoptDecoder: this.meshoptDecoder
    });
    c.fileLoader.setRequestHeader(this.requestHeader);
    for (let h = 0; h < this.pluginCallbacks.length; h++) {
      const l = this.pluginCallbacks[h](c);
      a[l.name] = l, r[l.name] = !0;
    }
    if (o.extensionsUsed)
      for (let h = 0; h < o.extensionsUsed.length; ++h) {
        const l = o.extensionsUsed[h], d = o.extensionsRequired || [];
        switch (l) {
          case R.KHR_MATERIALS_UNLIT:
            r[l] = new An();
            break;
          case R.KHR_DRACO_MESH_COMPRESSION:
            r[l] = new Cn(o, this.dracoLoader);
            break;
          case R.KHR_TEXTURE_TRANSFORM:
            r[l] = new Fn();
            break;
          case R.KHR_MESH_QUANTIZATION:
            r[l] = new Hn();
            break;
          default:
            d.indexOf(l) >= 0 && a[l] === void 0 && console.warn('THREE.GLTFLoader: Unknown extension "' + l + '".');
        }
      }
    c.setExtensions(r), c.setPlugins(a), c.parse(e, s);
  }
  parseAsync(n, t) {
    const e = this;
    return new Promise(function(s, o) {
      e.parse(n, t, s, o);
    });
  }
}
function En() {
  let f = {};
  return {
    get: function(n) {
      return f[n];
    },
    add: function(n, t) {
      f[n] = t;
    },
    remove: function(n) {
      delete f[n];
    },
    removeAll: function() {
      f = {};
    }
  };
}
const R = {
  KHR_BINARY_GLTF: "KHR_binary_glTF",
  KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
  KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
  KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
  KHR_MATERIALS_IOR: "KHR_materials_ior",
  KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
  KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
  KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
  KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
  KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
  KHR_MATERIALS_VOLUME: "KHR_materials_volume",
  KHR_TEXTURE_BASISU: "KHR_texture_basisu",
  KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
  KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
  KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
  EXT_TEXTURE_WEBP: "EXT_texture_webp",
  EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
  EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
};
class bn {
  constructor(n) {
    this.parser = n, this.name = R.KHR_LIGHTS_PUNCTUAL, this.cache = { refs: {}, uses: {} };
  }
  _markDefs() {
    const n = this.parser, t = this.parser.json.nodes || [];
    for (let e = 0, s = t.length; e < s; e++) {
      const o = t[e];
      o.extensions && o.extensions[this.name] && o.extensions[this.name].light !== void 0 && n._addNodeRef(this.cache, o.extensions[this.name].light);
    }
  }
  _loadLight(n) {
    const t = this.parser, e = "light:" + n;
    let s = t.cache.get(e);
    if (s)
      return s;
    const o = t.json, i = ((o.extensions && o.extensions[this.name] || {}).lights || [])[n];
    let c;
    const h = new B(16777215);
    i.color !== void 0 && h.fromArray(i.color);
    const l = i.range !== void 0 ? i.range : 0;
    switch (i.type) {
      case "directional":
        c = new et(h), c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      case "point":
        c = new Nt(h), c.distance = l;
        break;
      case "spot":
        c = new St(h), c.distance = l, i.spot = i.spot || {}, i.spot.innerConeAngle = i.spot.innerConeAngle !== void 0 ? i.spot.innerConeAngle : 0, i.spot.outerConeAngle = i.spot.outerConeAngle !== void 0 ? i.spot.outerConeAngle : Math.PI / 4, c.angle = i.spot.outerConeAngle, c.penumbra = 1 - i.spot.innerConeAngle / i.spot.outerConeAngle, c.target.position.set(0, 0, -1), c.add(c.target);
        break;
      default:
        throw new Error("THREE.GLTFLoader: Unexpected light type: " + i.type);
    }
    return c.position.set(0, 0, 0), c.decay = 2, K(c, i), i.intensity !== void 0 && (c.intensity = i.intensity), c.name = t.createUniqueName(i.name || "light_" + n), s = Promise.resolve(c), t.cache.add(e, s), s;
  }
  getDependency(n, t) {
    if (n === "light")
      return this._loadLight(t);
  }
  createNodeAttachment(n) {
    const t = this, e = this.parser, o = e.json.nodes[n], a = (o.extensions && o.extensions[this.name] || {}).light;
    return a === void 0 ? null : this._loadLight(a).then(function(i) {
      return e._getNodeRef(t.cache, a, i);
    });
  }
}
class An {
  constructor() {
    this.name = R.KHR_MATERIALS_UNLIT;
  }
  getMaterialType() {
    return ne;
  }
  extendParams(n, t, e) {
    const s = [];
    n.color = new B(1, 1, 1), n.opacity = 1;
    const o = t.pbrMetallicRoughness;
    if (o) {
      if (Array.isArray(o.baseColorFactor)) {
        const r = o.baseColorFactor;
        n.color.fromArray(r), n.opacity = r[3];
      }
      o.baseColorTexture !== void 0 && s.push(e.assignTexture(n, "map", o.baseColorTexture, J));
    }
    return Promise.all(s);
  }
}
class Rn {
  constructor(n) {
    this.parser = n, this.name = R.KHR_MATERIALS_EMISSIVE_STRENGTH;
  }
  extendMaterialParams(n, t) {
    const s = this.parser.json.materials[n];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const o = s.extensions[this.name].emissiveStrength;
    return o !== void 0 && (t.emissiveIntensity = o), Promise.resolve();
  }
}
class wn {
  constructor(n) {
    this.parser = n, this.name = R.KHR_MATERIALS_CLEARCOAT;
  }
  getMaterialType(n) {
    const e = this.parser.json.materials[n];
    return !e.extensions || !e.extensions[this.name] ? null : X;
  }
  extendMaterialParams(n, t) {
    const e = this.parser, s = e.json.materials[n];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const o = [], r = s.extensions[this.name];
    if (r.clearcoatFactor !== void 0 && (t.clearcoat = r.clearcoatFactor), r.clearcoatTexture !== void 0 && o.push(e.assignTexture(t, "clearcoatMap", r.clearcoatTexture)), r.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = r.clearcoatRoughnessFactor), r.clearcoatRoughnessTexture !== void 0 && o.push(e.assignTexture(t, "clearcoatRoughnessMap", r.clearcoatRoughnessTexture)), r.clearcoatNormalTexture !== void 0 && (o.push(e.assignTexture(t, "clearcoatNormalMap", r.clearcoatNormalTexture)), r.clearcoatNormalTexture.scale !== void 0)) {
      const a = r.clearcoatNormalTexture.scale;
      t.clearcoatNormalScale = new I(a, a);
    }
    return Promise.all(o);
  }
}
class Ln {
  constructor(n) {
    this.parser = n, this.name = R.KHR_MATERIALS_IRIDESCENCE;
  }
  getMaterialType(n) {
    const e = this.parser.json.materials[n];
    return !e.extensions || !e.extensions[this.name] ? null : X;
  }
  extendMaterialParams(n, t) {
    const e = this.parser, s = e.json.materials[n];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const o = [], r = s.extensions[this.name];
    return r.iridescenceFactor !== void 0 && (t.iridescence = r.iridescenceFactor), r.iridescenceTexture !== void 0 && o.push(e.assignTexture(t, "iridescenceMap", r.iridescenceTexture)), r.iridescenceIor !== void 0 && (t.iridescenceIOR = r.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), r.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = r.iridescenceThicknessMinimum), r.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = r.iridescenceThicknessMaximum), r.iridescenceThicknessTexture !== void 0 && o.push(e.assignTexture(t, "iridescenceThicknessMap", r.iridescenceThicknessTexture)), Promise.all(o);
  }
}
class xn {
  constructor(n) {
    this.parser = n, this.name = R.KHR_MATERIALS_SHEEN;
  }
  getMaterialType(n) {
    const e = this.parser.json.materials[n];
    return !e.extensions || !e.extensions[this.name] ? null : X;
  }
  extendMaterialParams(n, t) {
    const e = this.parser, s = e.json.materials[n];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const o = [];
    t.sheenColor = new B(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1;
    const r = s.extensions[this.name];
    return r.sheenColorFactor !== void 0 && t.sheenColor.fromArray(r.sheenColorFactor), r.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = r.sheenRoughnessFactor), r.sheenColorTexture !== void 0 && o.push(e.assignTexture(t, "sheenColorMap", r.sheenColorTexture, J)), r.sheenRoughnessTexture !== void 0 && o.push(e.assignTexture(t, "sheenRoughnessMap", r.sheenRoughnessTexture)), Promise.all(o);
  }
}
class _n {
  constructor(n) {
    this.parser = n, this.name = R.KHR_MATERIALS_TRANSMISSION;
  }
  getMaterialType(n) {
    const e = this.parser.json.materials[n];
    return !e.extensions || !e.extensions[this.name] ? null : X;
  }
  extendMaterialParams(n, t) {
    const e = this.parser, s = e.json.materials[n];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const o = [], r = s.extensions[this.name];
    return r.transmissionFactor !== void 0 && (t.transmission = r.transmissionFactor), r.transmissionTexture !== void 0 && o.push(e.assignTexture(t, "transmissionMap", r.transmissionTexture)), Promise.all(o);
  }
}
class Mn {
  constructor(n) {
    this.parser = n, this.name = R.KHR_MATERIALS_VOLUME;
  }
  getMaterialType(n) {
    const e = this.parser.json.materials[n];
    return !e.extensions || !e.extensions[this.name] ? null : X;
  }
  extendMaterialParams(n, t) {
    const e = this.parser, s = e.json.materials[n];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const o = [], r = s.extensions[this.name];
    t.thickness = r.thicknessFactor !== void 0 ? r.thicknessFactor : 0, r.thicknessTexture !== void 0 && o.push(e.assignTexture(t, "thicknessMap", r.thicknessTexture)), t.attenuationDistance = r.attenuationDistance || 1 / 0;
    const a = r.attenuationColor || [1, 1, 1];
    return t.attenuationColor = new B(a[0], a[1], a[2]), Promise.all(o);
  }
}
class Sn {
  constructor(n) {
    this.parser = n, this.name = R.KHR_MATERIALS_IOR;
  }
  getMaterialType(n) {
    const e = this.parser.json.materials[n];
    return !e.extensions || !e.extensions[this.name] ? null : X;
  }
  extendMaterialParams(n, t) {
    const s = this.parser.json.materials[n];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const o = s.extensions[this.name];
    return t.ior = o.ior !== void 0 ? o.ior : 1.5, Promise.resolve();
  }
}
class Nn {
  constructor(n) {
    this.parser = n, this.name = R.KHR_MATERIALS_SPECULAR;
  }
  getMaterialType(n) {
    const e = this.parser.json.materials[n];
    return !e.extensions || !e.extensions[this.name] ? null : X;
  }
  extendMaterialParams(n, t) {
    const e = this.parser, s = e.json.materials[n];
    if (!s.extensions || !s.extensions[this.name])
      return Promise.resolve();
    const o = [], r = s.extensions[this.name];
    t.specularIntensity = r.specularFactor !== void 0 ? r.specularFactor : 1, r.specularTexture !== void 0 && o.push(e.assignTexture(t, "specularIntensityMap", r.specularTexture));
    const a = r.specularColorFactor || [1, 1, 1];
    return t.specularColor = new B(a[0], a[1], a[2]), r.specularColorTexture !== void 0 && o.push(e.assignTexture(t, "specularColorMap", r.specularColorTexture, J)), Promise.all(o);
  }
}
class In {
  constructor(n) {
    this.parser = n, this.name = R.KHR_TEXTURE_BASISU;
  }
  loadTexture(n) {
    const t = this.parser, e = t.json, s = e.textures[n];
    if (!s.extensions || !s.extensions[this.name])
      return null;
    const o = s.extensions[this.name], r = t.options.ktx2Loader;
    if (!r) {
      if (e.extensionsRequired && e.extensionsRequired.indexOf(this.name) >= 0)
        throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
      return null;
    }
    return t.loadTextureImage(n, o.source, r);
  }
}
class On {
  constructor(n) {
    this.parser = n, this.name = R.EXT_TEXTURE_WEBP, this.isSupported = null;
  }
  loadTexture(n) {
    const t = this.name, e = this.parser, s = e.json, o = s.textures[n];
    if (!o.extensions || !o.extensions[t])
      return null;
    const r = o.extensions[t], a = s.images[r.source];
    let i = e.textureLoader;
    if (a.uri) {
      const c = e.options.manager.getHandler(a.uri);
      c !== null && (i = c);
    }
    return this.detectSupport().then(function(c) {
      if (c)
        return e.loadTextureImage(n, r.source, i);
      if (s.extensionsRequired && s.extensionsRequired.indexOf(t) >= 0)
        throw new Error("THREE.GLTFLoader: WebP required by asset but unsupported.");
      return e.loadTexture(n);
    });
  }
  detectSupport() {
    return this.isSupported || (this.isSupported = new Promise(function(n) {
      const t = new Image();
      t.src = "data:image/webp;base64,UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA", t.onload = t.onerror = function() {
        n(t.height === 1);
      };
    })), this.isSupported;
  }
}
class Pn {
  constructor(n) {
    this.name = R.EXT_MESHOPT_COMPRESSION, this.parser = n;
  }
  loadBufferView(n) {
    const t = this.parser.json, e = t.bufferViews[n];
    if (e.extensions && e.extensions[this.name]) {
      const s = e.extensions[this.name], o = this.parser.getDependency("buffer", s.buffer), r = this.parser.options.meshoptDecoder;
      if (!r || !r.supported) {
        if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0)
          throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
        return null;
      }
      return o.then(function(a) {
        const i = s.byteOffset || 0, c = s.byteLength || 0, h = s.count, l = s.byteStride, d = new Uint8Array(a, i, c);
        return r.decodeGltfBufferAsync ? r.decodeGltfBufferAsync(h, l, d, s.mode, s.filter).then(function(p) {
          return p.buffer;
        }) : r.ready.then(function() {
          const p = new ArrayBuffer(h * l);
          return r.decodeGltfBuffer(new Uint8Array(p), h, l, d, s.mode, s.filter), p;
        });
      });
    } else
      return null;
  }
}
class Dn {
  constructor(n) {
    this.name = R.EXT_MESH_GPU_INSTANCING, this.parser = n;
  }
  createNodeMesh(n) {
    const t = this.parser.json, e = t.nodes[n];
    if (!e.extensions || !e.extensions[this.name] || e.mesh === void 0)
      return null;
    const s = t.meshes[e.mesh];
    for (const c of s.primitives)
      if (c.mode !== k.TRIANGLES && c.mode !== k.TRIANGLE_STRIP && c.mode !== k.TRIANGLE_FAN && c.mode !== void 0)
        return null;
    const r = e.extensions[this.name].attributes, a = [], i = {};
    for (const c in r)
      a.push(this.parser.getDependency("accessor", r[c]).then((h) => (i[c] = h, i[c])));
    return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(n)), Promise.all(a).then((c) => {
      const h = c.pop(), l = h.isGroup ? h.children : [h], d = c[0].count, p = [];
      for (const g of l) {
        const E = new le(), m = new O(), T = new ae(), w = new O(1, 1, 1), A = new It(g.geometry, g.material, d);
        for (let L = 0; L < d; L++)
          i.TRANSLATION && m.fromBufferAttribute(i.TRANSLATION, L), i.ROTATION && T.fromBufferAttribute(i.ROTATION, L), i.SCALE && w.fromBufferAttribute(i.SCALE, L), A.setMatrixAt(L, E.compose(m, T, w));
        for (const L in i)
          L !== "TRANSLATION" && L !== "ROTATION" && L !== "SCALE" && g.geometry.setAttribute(L, i[L]);
        tt.prototype.copy.call(A, g), A.frustumCulled = !1, this.parser.assignFinalMaterial(A), p.push(A);
      }
      return h.isGroup ? (h.clear(), h.add(...p), h) : p[0];
    }));
  }
}
const at = "glTF", ee = 12, Ye = { JSON: 1313821514, BIN: 5130562 };
class kn {
  constructor(n) {
    this.name = R.KHR_BINARY_GLTF, this.content = null, this.body = null;
    const t = new DataView(n, 0, ee), e = new TextDecoder();
    if (this.header = {
      magic: e.decode(new Uint8Array(n.slice(0, 4))),
      version: t.getUint32(4, !0),
      length: t.getUint32(8, !0)
    }, this.header.magic !== at)
      throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
    if (this.header.version < 2)
      throw new Error("THREE.GLTFLoader: Legacy binary file detected.");
    const s = this.header.length - ee, o = new DataView(n, ee);
    let r = 0;
    for (; r < s; ) {
      const a = o.getUint32(r, !0);
      r += 4;
      const i = o.getUint32(r, !0);
      if (r += 4, i === Ye.JSON) {
        const c = new Uint8Array(n, ee + r, a);
        this.content = e.decode(c);
      } else if (i === Ye.BIN) {
        const c = ee + r;
        this.body = n.slice(c, c + a);
      }
      r += a;
    }
    if (this.content === null)
      throw new Error("THREE.GLTFLoader: JSON content not found.");
  }
}
class Cn {
  constructor(n, t) {
    if (!t)
      throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
    this.name = R.KHR_DRACO_MESH_COMPRESSION, this.json = n, this.dracoLoader = t, this.dracoLoader.preload();
  }
  decodePrimitive(n, t) {
    const e = this.json, s = this.dracoLoader, o = n.extensions[this.name].bufferView, r = n.extensions[this.name].attributes, a = {}, i = {}, c = {};
    for (const h in r) {
      const l = we[h] || h.toLowerCase();
      a[l] = r[h];
    }
    for (const h in n.attributes) {
      const l = we[h] || h.toLowerCase();
      if (r[h] !== void 0) {
        const d = e.accessors[n.attributes[h]], p = Q[d.componentType];
        c[l] = p.name, i[l] = d.normalized === !0;
      }
    }
    return t.getDependency("bufferView", o).then(function(h) {
      return new Promise(function(l) {
        s.decodeDracoFile(h, function(d) {
          for (const p in d.attributes) {
            const g = d.attributes[p], E = i[p];
            E !== void 0 && (g.normalized = E);
          }
          l(d);
        }, a, c);
      });
    });
  }
}
class Fn {
  constructor() {
    this.name = R.KHR_TEXTURE_TRANSFORM;
  }
  extendTexture(n, t) {
    return t.texCoord !== void 0 && console.warn('THREE.GLTFLoader: Custom UV sets in "' + this.name + '" extension not yet supported.'), t.offset === void 0 && t.rotation === void 0 && t.scale === void 0 || (n = n.clone(), t.offset !== void 0 && n.offset.fromArray(t.offset), t.rotation !== void 0 && (n.rotation = t.rotation), t.scale !== void 0 && n.repeat.fromArray(t.scale), n.needsUpdate = !0), n;
  }
}
class Hn {
  constructor() {
    this.name = R.KHR_MESH_QUANTIZATION;
  }
}
class ct extends cn {
  constructor(n, t, e, s) {
    super(n, t, e, s);
  }
  copySampleValue_(n) {
    const t = this.resultBuffer, e = this.sampleValues, s = this.valueSize, o = n * s * 3 + s;
    for (let r = 0; r !== s; r++)
      t[r] = e[o + r];
    return t;
  }
  interpolate_(n, t, e, s) {
    const o = this.resultBuffer, r = this.sampleValues, a = this.valueSize, i = a * 2, c = a * 3, h = s - t, l = (e - t) / h, d = l * l, p = d * l, g = n * c, E = g - c, m = -2 * p + 3 * d, T = p - d, w = 1 - m, A = T - d + l;
    for (let L = 0; L !== a; L++) {
      const b = r[E + L + a], S = r[E + L + i] * h, N = r[g + L + a], P = r[g + L] * h;
      o[L] = w * b + A * S + m * N + T * P;
    }
    return o;
  }
}
const Un = new ae();
class jn extends ct {
  interpolate_(n, t, e, s) {
    const o = super.interpolate_(n, t, e, s);
    return Un.fromArray(o).normalize().toArray(o), o;
  }
}
const k = {
  FLOAT: 5126,
  //FLOAT_MAT2: 35674,
  FLOAT_MAT3: 35675,
  FLOAT_MAT4: 35676,
  FLOAT_VEC2: 35664,
  FLOAT_VEC3: 35665,
  FLOAT_VEC4: 35666,
  LINEAR: 9729,
  REPEAT: 10497,
  SAMPLER_2D: 35678,
  POINTS: 0,
  LINES: 1,
  LINE_LOOP: 2,
  LINE_STRIP: 3,
  TRIANGLES: 4,
  TRIANGLE_STRIP: 5,
  TRIANGLE_FAN: 6,
  UNSIGNED_BYTE: 5121,
  UNSIGNED_SHORT: 5123
}, Q = {
  5120: Int8Array,
  5121: Uint8Array,
  5122: Int16Array,
  5123: Uint16Array,
  5125: Uint32Array,
  5126: Float32Array
}, We = {
  9728: qt,
  9729: nt,
  9984: Zt,
  9985: Qt,
  9986: Jt,
  9987: st
}, qe = {
  33071: $t,
  33648: en,
  10497: Re
}, Te = {
  SCALAR: 1,
  VEC2: 2,
  VEC3: 3,
  VEC4: 4,
  MAT2: 4,
  MAT3: 9,
  MAT4: 16
}, we = {
  POSITION: "position",
  NORMAL: "normal",
  TANGENT: "tangent",
  TEXCOORD_0: "uv",
  TEXCOORD_1: "uv2",
  COLOR_0: "color",
  WEIGHTS_0: "skinWeight",
  JOINTS_0: "skinIndex"
}, v = {
  scale: "scale",
  translation: "position",
  rotation: "quaternion",
  weights: "morphTargetInfluences"
}, Gn = {
  CUBICSPLINE: void 0,
  // We use a custom interpolant (GLTFCubicSplineInterpolation) for CUBICSPLINE tracks. Each
  // keyframe track will be initialized with a default interpolation type, then modified.
  LINEAR: it,
  STEP: tn
}, ye = {
  OPAQUE: "OPAQUE",
  MASK: "MASK",
  BLEND: "BLEND"
};
function vn(f) {
  return f.DefaultMaterial === void 0 && (f.DefaultMaterial = new z({
    color: 16777215,
    emissive: 0,
    metalness: 1,
    roughness: 1,
    transparent: !1,
    depthTest: !0,
    side: nn
  })), f.DefaultMaterial;
}
function te(f, n, t) {
  for (const e in t.extensions)
    f[e] === void 0 && (n.userData.gltfExtensions = n.userData.gltfExtensions || {}, n.userData.gltfExtensions[e] = t.extensions[e]);
}
function K(f, n) {
  n.extras !== void 0 && (typeof n.extras == "object" ? Object.assign(f.userData, n.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + n.extras));
}
function Kn(f, n, t) {
  let e = !1, s = !1, o = !1;
  for (let c = 0, h = n.length; c < h; c++) {
    const l = n[c];
    if (l.POSITION !== void 0 && (e = !0), l.NORMAL !== void 0 && (s = !0), l.COLOR_0 !== void 0 && (o = !0), e && s && o)
      break;
  }
  if (!e && !s && !o)
    return Promise.resolve(f);
  const r = [], a = [], i = [];
  for (let c = 0, h = n.length; c < h; c++) {
    const l = n[c];
    if (e) {
      const d = l.POSITION !== void 0 ? t.getDependency("accessor", l.POSITION) : f.attributes.position;
      r.push(d);
    }
    if (s) {
      const d = l.NORMAL !== void 0 ? t.getDependency("accessor", l.NORMAL) : f.attributes.normal;
      a.push(d);
    }
    if (o) {
      const d = l.COLOR_0 !== void 0 ? t.getDependency("accessor", l.COLOR_0) : f.attributes.color;
      i.push(d);
    }
  }
  return Promise.all([
    Promise.all(r),
    Promise.all(a),
    Promise.all(i)
  ]).then(function(c) {
    const h = c[0], l = c[1], d = c[2];
    return e && (f.morphAttributes.position = h), s && (f.morphAttributes.normal = l), o && (f.morphAttributes.color = d), f.morphTargetsRelative = !0, f;
  });
}
function Bn(f, n) {
  if (f.updateMorphTargets(), n.weights !== void 0)
    for (let t = 0, e = n.weights.length; t < e; t++)
      f.morphTargetInfluences[t] = n.weights[t];
  if (n.extras && Array.isArray(n.extras.targetNames)) {
    const t = n.extras.targetNames;
    if (f.morphTargetInfluences.length === t.length) {
      f.morphTargetDictionary = {};
      for (let e = 0, s = t.length; e < s; e++)
        f.morphTargetDictionary[t[e]] = e;
    } else
      console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
  }
}
function Vn(f) {
  const n = f.extensions && f.extensions[R.KHR_DRACO_MESH_COMPRESSION];
  let t;
  return n ? t = "draco:" + n.bufferView + ":" + n.indices + ":" + Ze(n.attributes) : t = f.indices + ":" + Ze(f.attributes) + ":" + f.mode, t;
}
function Ze(f) {
  let n = "";
  const t = Object.keys(f).sort();
  for (let e = 0, s = t.length; e < s; e++)
    n += t[e] + ":" + f[t[e]] + ";";
  return n;
}
function Le(f) {
  switch (f) {
    case Int8Array:
      return 1 / 127;
    case Uint8Array:
      return 1 / 255;
    case Int16Array:
      return 1 / 32767;
    case Uint16Array:
      return 1 / 65535;
    default:
      throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
  }
}
function zn(f) {
  return f.search(/\.jpe?g($|\?)/i) > 0 || f.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : f.search(/\.webp($|\?)/i) > 0 || f.search(/^data\:image\/webp/) === 0 ? "image/webp" : "image/png";
}
const Xn = new le();
class Yn {
  constructor(n = {}, t = {}) {
    this.json = n, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new En(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.meshCache = { refs: {}, uses: {} }, this.cameraCache = { refs: {}, uses: {} }, this.lightCache = { refs: {}, uses: {} }, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
    let e = !1, s = !1, o = -1;
    typeof navigator < "u" && (e = /^((?!chrome|android).)*safari/i.test(navigator.userAgent) === !0, s = navigator.userAgent.indexOf("Firefox") > -1, o = s ? navigator.userAgent.match(/Firefox\/([0-9]+)\./)[1] : -1), typeof createImageBitmap > "u" || e || s && o < 98 ? this.textureLoader = new Ot(this.options.manager) : this.textureLoader = new Pt(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new ce(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
  }
  setExtensions(n) {
    this.extensions = n;
  }
  setPlugins(n) {
    this.plugins = n;
  }
  parse(n, t) {
    const e = this, s = this.json, o = this.extensions;
    this.cache.removeAll(), this._invokeAll(function(r) {
      return r._markDefs && r._markDefs();
    }), Promise.all(this._invokeAll(function(r) {
      return r.beforeRoot && r.beforeRoot();
    })).then(function() {
      return Promise.all([
        e.getDependencies("scene"),
        e.getDependencies("animation"),
        e.getDependencies("camera")
      ]);
    }).then(function(r) {
      const a = {
        scene: r[0][s.scene || 0],
        scenes: r[0],
        animations: r[1],
        cameras: r[2],
        asset: s.asset,
        parser: e,
        userData: {}
      };
      te(o, a, s), K(a, s), Promise.all(e._invokeAll(function(i) {
        return i.afterRoot && i.afterRoot(a);
      })).then(function() {
        n(a);
      });
    }).catch(t);
  }
  /**
   * Marks the special nodes/meshes in json for efficient parse.
   */
  _markDefs() {
    const n = this.json.nodes || [], t = this.json.skins || [], e = this.json.meshes || [];
    for (let s = 0, o = t.length; s < o; s++) {
      const r = t[s].joints;
      for (let a = 0, i = r.length; a < i; a++)
        n[r[a]].isBone = !0;
    }
    for (let s = 0, o = n.length; s < o; s++) {
      const r = n[s];
      r.mesh !== void 0 && (this._addNodeRef(this.meshCache, r.mesh), r.skin !== void 0 && (e[r.mesh].isSkinnedMesh = !0)), r.camera !== void 0 && this._addNodeRef(this.cameraCache, r.camera);
    }
  }
  /**
   * Counts references to shared node / Object3D resources. These resources
   * can be reused, or "instantiated", at multiple nodes in the scene
   * hierarchy. Mesh, Camera, and Light instances are instantiated and must
   * be marked. Non-scenegraph resources (like Materials, Geometries, and
   * Textures) can be reused directly and are not marked here.
   *
   * Example: CesiumMilkTruck sample model reuses "Wheel" meshes.
   */
  _addNodeRef(n, t) {
    t !== void 0 && (n.refs[t] === void 0 && (n.refs[t] = n.uses[t] = 0), n.refs[t]++);
  }
  /** Returns a reference to a shared resource, cloning it if necessary. */
  _getNodeRef(n, t, e) {
    if (n.refs[t] <= 1)
      return e;
    const s = e.clone(), o = (r, a) => {
      const i = this.associations.get(r);
      i != null && this.associations.set(a, i);
      for (const [c, h] of r.children.entries())
        o(h, a.children[c]);
    };
    return o(e, s), s.name += "_instance_" + n.uses[t]++, s;
  }
  _invokeOne(n) {
    const t = Object.values(this.plugins);
    t.push(this);
    for (let e = 0; e < t.length; e++) {
      const s = n(t[e]);
      if (s)
        return s;
    }
    return null;
  }
  _invokeAll(n) {
    const t = Object.values(this.plugins);
    t.unshift(this);
    const e = [];
    for (let s = 0; s < t.length; s++) {
      const o = n(t[s]);
      o && e.push(o);
    }
    return e;
  }
  /**
   * Requests the specified dependency asynchronously, with caching.
   * @param {string} type
   * @param {number} index
   * @return {Promise<Object3D|Material|THREE.Texture|AnimationClip|ArrayBuffer|Object>}
   */
  getDependency(n, t) {
    const e = n + ":" + t;
    let s = this.cache.get(e);
    if (!s) {
      switch (n) {
        case "scene":
          s = this.loadScene(t);
          break;
        case "node":
          s = this._invokeOne(function(o) {
            return o.loadNode && o.loadNode(t);
          });
          break;
        case "mesh":
          s = this._invokeOne(function(o) {
            return o.loadMesh && o.loadMesh(t);
          });
          break;
        case "accessor":
          s = this.loadAccessor(t);
          break;
        case "bufferView":
          s = this._invokeOne(function(o) {
            return o.loadBufferView && o.loadBufferView(t);
          });
          break;
        case "buffer":
          s = this.loadBuffer(t);
          break;
        case "material":
          s = this._invokeOne(function(o) {
            return o.loadMaterial && o.loadMaterial(t);
          });
          break;
        case "texture":
          s = this._invokeOne(function(o) {
            return o.loadTexture && o.loadTexture(t);
          });
          break;
        case "skin":
          s = this.loadSkin(t);
          break;
        case "animation":
          s = this._invokeOne(function(o) {
            return o.loadAnimation && o.loadAnimation(t);
          });
          break;
        case "camera":
          s = this.loadCamera(t);
          break;
        default:
          if (s = this._invokeOne(function(o) {
            return o != this && o.getDependency && o.getDependency(n, t);
          }), !s)
            throw new Error("Unknown type: " + n);
          break;
      }
      this.cache.add(e, s);
    }
    return s;
  }
  /**
   * Requests all dependencies of the specified type asynchronously, with caching.
   * @param {string} type
   * @return {Promise<Array<Object>>}
   */
  getDependencies(n) {
    let t = this.cache.get(n);
    if (!t) {
      const e = this, s = this.json[n + (n === "mesh" ? "es" : "s")] || [];
      t = Promise.all(s.map(function(o, r) {
        return e.getDependency(n, r);
      })), this.cache.add(n, t);
    }
    return t;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBuffer(n) {
    const t = this.json.buffers[n], e = this.fileLoader;
    if (t.type && t.type !== "arraybuffer")
      throw new Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
    if (t.uri === void 0 && n === 0)
      return Promise.resolve(this.extensions[R.KHR_BINARY_GLTF].body);
    const s = this.options;
    return new Promise(function(o, r) {
      e.load(Ae.resolveURL(t.uri, s.path), o, void 0, function() {
        r(new Error('THREE.GLTFLoader: Failed to load buffer "' + t.uri + '".'));
      });
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#buffers-and-buffer-views
   * @param {number} bufferViewIndex
   * @return {Promise<ArrayBuffer>}
   */
  loadBufferView(n) {
    const t = this.json.bufferViews[n];
    return this.getDependency("buffer", t.buffer).then(function(e) {
      const s = t.byteLength || 0, o = t.byteOffset || 0;
      return e.slice(o, o + s);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#accessors
   * @param {number} accessorIndex
   * @return {Promise<BufferAttribute|InterleavedBufferAttribute>}
   */
  loadAccessor(n) {
    const t = this, e = this.json, s = this.json.accessors[n];
    if (s.bufferView === void 0 && s.sparse === void 0) {
      const r = Te[s.type], a = Q[s.componentType], i = s.normalized === !0, c = new a(s.count * r);
      return Promise.resolve(new se(c, r, i));
    }
    const o = [];
    return s.bufferView !== void 0 ? o.push(this.getDependency("bufferView", s.bufferView)) : o.push(null), s.sparse !== void 0 && (o.push(this.getDependency("bufferView", s.sparse.indices.bufferView)), o.push(this.getDependency("bufferView", s.sparse.values.bufferView))), Promise.all(o).then(function(r) {
      const a = r[0], i = Te[s.type], c = Q[s.componentType], h = c.BYTES_PER_ELEMENT, l = h * i, d = s.byteOffset || 0, p = s.bufferView !== void 0 ? e.bufferViews[s.bufferView].byteStride : void 0, g = s.normalized === !0;
      let E, m;
      if (p && p !== l) {
        const T = Math.floor(d / p), w = "InterleavedBuffer:" + s.bufferView + ":" + s.componentType + ":" + T + ":" + s.count;
        let A = t.cache.get(w);
        A || (E = new c(a, T * p, s.count * p / h), A = new Dt(E, p / h), t.cache.add(w, A)), m = new kt(A, i, d % p / h, g);
      } else
        a === null ? E = new c(s.count * i) : E = new c(a, d, s.count * i), m = new se(E, i, g);
      if (s.sparse !== void 0) {
        const T = Te.SCALAR, w = Q[s.sparse.indices.componentType], A = s.sparse.indices.byteOffset || 0, L = s.sparse.values.byteOffset || 0, b = new w(r[1], A, s.sparse.count * T), S = new c(r[2], L, s.sparse.count * i);
        a !== null && (m = new se(m.array.slice(), m.itemSize, m.normalized));
        for (let N = 0, P = b.length; N < P; N++) {
          const D = b[N];
          if (m.setX(D, S[N * i]), i >= 2 && m.setY(D, S[N * i + 1]), i >= 3 && m.setZ(D, S[N * i + 2]), i >= 4 && m.setW(D, S[N * i + 3]), i >= 5)
            throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
        }
      }
      return m;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#textures
   * @param {number} textureIndex
   * @return {Promise<THREE.Texture|null>}
   */
  loadTexture(n) {
    const t = this.json, e = this.options, o = t.textures[n].source, r = t.images[o];
    let a = this.textureLoader;
    if (r.uri) {
      const i = e.manager.getHandler(r.uri);
      i !== null && (a = i);
    }
    return this.loadTextureImage(n, o, a);
  }
  loadTextureImage(n, t, e) {
    const s = this, o = this.json, r = o.textures[n], a = o.images[t], i = (a.uri || a.bufferView) + ":" + r.sampler;
    if (this.textureCache[i])
      return this.textureCache[i];
    const c = this.loadImageSource(t, e).then(function(h) {
      h.flipY = !1, h.name = r.name || a.name || "";
      const d = (o.samplers || {})[r.sampler] || {};
      return h.magFilter = We[d.magFilter] || nt, h.minFilter = We[d.minFilter] || st, h.wrapS = qe[d.wrapS] || Re, h.wrapT = qe[d.wrapT] || Re, s.associations.set(h, { textures: n }), h;
    }).catch(function() {
      return null;
    });
    return this.textureCache[i] = c, c;
  }
  loadImageSource(n, t) {
    const e = this, s = this.json, o = this.options;
    if (this.sourceCache[n] !== void 0)
      return this.sourceCache[n].then((l) => l.clone());
    const r = s.images[n], a = self.URL || self.webkitURL;
    let i = r.uri || "", c = !1;
    if (r.bufferView !== void 0)
      i = e.getDependency("bufferView", r.bufferView).then(function(l) {
        c = !0;
        const d = new Blob([l], { type: r.mimeType });
        return i = a.createObjectURL(d), i;
      });
    else if (r.uri === void 0)
      throw new Error("THREE.GLTFLoader: Image " + n + " is missing URI and bufferView");
    const h = Promise.resolve(i).then(function(l) {
      return new Promise(function(d, p) {
        let g = d;
        t.isImageBitmapLoader === !0 && (g = function(E) {
          const m = new Ke(E);
          m.needsUpdate = !0, d(m);
        }), t.load(Ae.resolveURL(l, o.path), g, void 0, p);
      });
    }).then(function(l) {
      return c === !0 && a.revokeObjectURL(i), l.userData.mimeType = r.mimeType || zn(r.uri), l;
    }).catch(function(l) {
      throw console.error("THREE.GLTFLoader: Couldn't load texture", i), l;
    });
    return this.sourceCache[n] = h, h;
  }
  /**
   * Asynchronously assigns a texture to the given material parameters.
   * @param {Object} materialParams
   * @param {string} mapName
   * @param {Object} mapDef
   * @return {Promise<Texture>}
   */
  assignTexture(n, t, e, s) {
    const o = this;
    return this.getDependency("texture", e.index).then(function(r) {
      if (!r)
        return null;
      if (e.texCoord !== void 0 && e.texCoord != 0 && !(t === "aoMap" && e.texCoord == 1) && console.warn("THREE.GLTFLoader: Custom UV set " + e.texCoord + " for texture " + t + " not yet supported."), o.extensions[R.KHR_TEXTURE_TRANSFORM]) {
        const a = e.extensions !== void 0 ? e.extensions[R.KHR_TEXTURE_TRANSFORM] : void 0;
        if (a) {
          const i = o.associations.get(r);
          r = o.extensions[R.KHR_TEXTURE_TRANSFORM].extendTexture(r, a), o.associations.set(r, i);
        }
      }
      return s !== void 0 && (r.encoding = s), n[t] = r, r;
    });
  }
  /**
   * Assigns final material to a Mesh, Line, or Points instance. The instance
   * already has a material (generated from the glTF material options alone)
   * but reuse of the same glTF material may require multiple threejs materials
   * to accommodate different primitive types, defines, etc. New materials will
   * be created if necessary, and reused from a cache.
   * @param  {Object3D} mesh Mesh, Line, or Points instance.
   */
  assignFinalMaterial(n) {
    const t = n.geometry;
    let e = n.material;
    const s = t.attributes.tangent === void 0, o = t.attributes.color !== void 0, r = t.attributes.normal === void 0;
    if (n.isPoints) {
      const a = "PointsMaterial:" + e.uuid;
      let i = this.cache.get(a);
      i || (i = new Ct(), pe.prototype.copy.call(i, e), i.color.copy(e.color), i.map = e.map, i.sizeAttenuation = !1, this.cache.add(a, i)), e = i;
    } else if (n.isLine) {
      const a = "LineBasicMaterial:" + e.uuid;
      let i = this.cache.get(a);
      i || (i = new Ft(), pe.prototype.copy.call(i, e), i.color.copy(e.color), this.cache.add(a, i)), e = i;
    }
    if (s || o || r) {
      let a = "ClonedMaterial:" + e.uuid + ":";
      s && (a += "derivative-tangents:"), o && (a += "vertex-colors:"), r && (a += "flat-shading:");
      let i = this.cache.get(a);
      i || (i = e.clone(), o && (i.vertexColors = !0), r && (i.flatShading = !0), s && (i.normalScale && (i.normalScale.y *= -1), i.clearcoatNormalScale && (i.clearcoatNormalScale.y *= -1)), this.cache.add(a, i), this.associations.set(i, this.associations.get(e))), e = i;
    }
    e.aoMap && t.attributes.uv2 === void 0 && t.attributes.uv !== void 0 && t.setAttribute("uv2", t.attributes.uv), n.material = e;
  }
  getMaterialType() {
    return z;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#materials
   * @param {number} materialIndex
   * @return {Promise<Material>}
   */
  loadMaterial(n) {
    const t = this, e = this.json, s = this.extensions, o = e.materials[n];
    let r;
    const a = {}, i = o.extensions || {}, c = [];
    if (i[R.KHR_MATERIALS_UNLIT]) {
      const l = s[R.KHR_MATERIALS_UNLIT];
      r = l.getMaterialType(), c.push(l.extendParams(a, o, t));
    } else {
      const l = o.pbrMetallicRoughness || {};
      if (a.color = new B(1, 1, 1), a.opacity = 1, Array.isArray(l.baseColorFactor)) {
        const d = l.baseColorFactor;
        a.color.fromArray(d), a.opacity = d[3];
      }
      l.baseColorTexture !== void 0 && c.push(t.assignTexture(a, "map", l.baseColorTexture, J)), a.metalness = l.metallicFactor !== void 0 ? l.metallicFactor : 1, a.roughness = l.roughnessFactor !== void 0 ? l.roughnessFactor : 1, l.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(a, "metalnessMap", l.metallicRoughnessTexture)), c.push(t.assignTexture(a, "roughnessMap", l.metallicRoughnessTexture))), r = this._invokeOne(function(d) {
        return d.getMaterialType && d.getMaterialType(n);
      }), c.push(Promise.all(this._invokeAll(function(d) {
        return d.extendMaterialParams && d.extendMaterialParams(n, a);
      })));
    }
    o.doubleSided === !0 && (a.side = Ht);
    const h = o.alphaMode || ye.OPAQUE;
    if (h === ye.BLEND ? (a.transparent = !0, a.depthWrite = !1) : (a.transparent = !1, h === ye.MASK && (a.alphaTest = o.alphaCutoff !== void 0 ? o.alphaCutoff : 0.5)), o.normalTexture !== void 0 && r !== ne && (c.push(t.assignTexture(a, "normalMap", o.normalTexture)), a.normalScale = new I(1, 1), o.normalTexture.scale !== void 0)) {
      const l = o.normalTexture.scale;
      a.normalScale.set(l, l);
    }
    return o.occlusionTexture !== void 0 && r !== ne && (c.push(t.assignTexture(a, "aoMap", o.occlusionTexture)), o.occlusionTexture.strength !== void 0 && (a.aoMapIntensity = o.occlusionTexture.strength)), o.emissiveFactor !== void 0 && r !== ne && (a.emissive = new B().fromArray(o.emissiveFactor)), o.emissiveTexture !== void 0 && r !== ne && c.push(t.assignTexture(a, "emissiveMap", o.emissiveTexture, J)), Promise.all(c).then(function() {
      const l = new r(a);
      return o.name && (l.name = o.name), K(l, o), t.associations.set(l, { materials: n }), o.extensions && te(s, l, o), l;
    });
  }
  /** When Object3D instances are targeted by animation, they need unique names. */
  createUniqueName(n) {
    const t = Ut.sanitizeNodeName(n || "");
    let e = t;
    for (let s = 1; this.nodeNamesUsed[e]; ++s)
      e = t + "_" + s;
    return this.nodeNamesUsed[e] = !0, e;
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#geometry
   *
   * Creates BufferGeometries from primitives.
   *
   * @param {Array<GLTF.Primitive>} primitives
   * @return {Promise<Array<BufferGeometry>>}
   */
  loadGeometries(n) {
    const t = this, e = this.extensions, s = this.primitiveCache;
    function o(a) {
      return e[R.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(a, t).then(function(i) {
        return Qe(i, a, t);
      });
    }
    const r = [];
    for (let a = 0, i = n.length; a < i; a++) {
      const c = n[a], h = Vn(c), l = s[h];
      if (l)
        r.push(l.promise);
      else {
        let d;
        c.extensions && c.extensions[R.KHR_DRACO_MESH_COMPRESSION] ? d = o(c) : d = Qe(new ot(), c, t), s[h] = { primitive: c, promise: d }, r.push(d);
      }
    }
    return Promise.all(r);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/blob/master/specification/2.0/README.md#meshes
   * @param {number} meshIndex
   * @return {Promise<Group|Mesh|SkinnedMesh>}
   */
  loadMesh(n) {
    const t = this, e = this.json, s = this.extensions, o = e.meshes[n], r = o.primitives, a = [];
    for (let i = 0, c = r.length; i < c; i++) {
      const h = r[i].material === void 0 ? vn(this.cache) : this.getDependency("material", r[i].material);
      a.push(h);
    }
    return a.push(t.loadGeometries(r)), Promise.all(a).then(function(i) {
      const c = i.slice(0, i.length - 1), h = i[i.length - 1], l = [];
      for (let p = 0, g = h.length; p < g; p++) {
        const E = h[p], m = r[p];
        let T;
        const w = c[p];
        if (m.mode === k.TRIANGLES || m.mode === k.TRIANGLE_STRIP || m.mode === k.TRIANGLE_FAN || m.mode === void 0)
          T = o.isSkinnedMesh === !0 ? new jt(E, w) : new rt(E, w), T.isSkinnedMesh === !0 && !T.geometry.attributes.skinWeight.normalized && T.normalizeSkinWeights(), m.mode === k.TRIANGLE_STRIP ? T.geometry = Xe(T.geometry, Je) : m.mode === k.TRIANGLE_FAN && (T.geometry = Xe(T.geometry, be));
        else if (m.mode === k.LINES)
          T = new Gt(E, w);
        else if (m.mode === k.LINE_STRIP)
          T = new vt(E, w);
        else if (m.mode === k.LINE_LOOP)
          T = new Kt(E, w);
        else if (m.mode === k.POINTS)
          T = new Bt(E, w);
        else
          throw new Error("THREE.GLTFLoader: Primitive mode unsupported: " + m.mode);
        Object.keys(T.geometry.morphAttributes).length > 0 && Bn(T, o), T.name = t.createUniqueName(o.name || "mesh_" + n), K(T, o), m.extensions && te(s, T, m), t.assignFinalMaterial(T), l.push(T);
      }
      for (let p = 0, g = l.length; p < g; p++)
        t.associations.set(l[p], {
          meshes: n,
          primitives: p
        });
      if (l.length === 1)
        return l[0];
      const d = new ie();
      t.associations.set(d, { meshes: n });
      for (let p = 0, g = l.length; p < g; p++)
        d.add(l[p]);
      return d;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#cameras
   * @param {number} cameraIndex
   * @return {Promise<THREE.Camera>}
   */
  loadCamera(n) {
    let t;
    const e = this.json.cameras[n], s = e[e.type];
    if (!s) {
      console.warn("THREE.GLTFLoader: Missing camera parameters.");
      return;
    }
    return e.type === "perspective" ? t = new xe(Vt.radToDeg(s.yfov), s.aspectRatio || 1, s.znear || 1, s.zfar || 2e6) : e.type === "orthographic" && (t = new zt(-s.xmag, s.xmag, s.ymag, -s.ymag, s.znear, s.zfar)), e.name && (t.name = this.createUniqueName(e.name)), K(t, e), Promise.resolve(t);
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#skins
   * @param {number} skinIndex
   * @return {Promise<Skeleton>}
   */
  loadSkin(n) {
    const t = this.json.skins[n], e = [];
    for (let s = 0, o = t.joints.length; s < o; s++)
      e.push(this.getDependency("node", t.joints[s]));
    return t.inverseBindMatrices !== void 0 ? e.push(this.getDependency("accessor", t.inverseBindMatrices)) : e.push(null), Promise.all(e).then(function(s) {
      const o = s.pop(), r = s, a = [], i = [];
      for (let c = 0, h = r.length; c < h; c++) {
        const l = r[c];
        if (l) {
          a.push(l);
          const d = new le();
          o !== null && d.fromArray(o.array, c * 16), i.push(d);
        } else
          console.warn('THREE.GLTFLoader: Joint "%s" could not be found.', t.joints[c]);
      }
      return new Xt(a, i);
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#animations
   * @param {number} animationIndex
   * @return {Promise<AnimationClip>}
   */
  loadAnimation(n) {
    const e = this.json.animations[n], s = [], o = [], r = [], a = [], i = [];
    for (let c = 0, h = e.channels.length; c < h; c++) {
      const l = e.channels[c], d = e.samplers[l.sampler], p = l.target, g = p.node, E = e.parameters !== void 0 ? e.parameters[d.input] : d.input, m = e.parameters !== void 0 ? e.parameters[d.output] : d.output;
      s.push(this.getDependency("node", g)), o.push(this.getDependency("accessor", E)), r.push(this.getDependency("accessor", m)), a.push(d), i.push(p);
    }
    return Promise.all([
      Promise.all(s),
      Promise.all(o),
      Promise.all(r),
      Promise.all(a),
      Promise.all(i)
    ]).then(function(c) {
      const h = c[0], l = c[1], d = c[2], p = c[3], g = c[4], E = [];
      for (let T = 0, w = h.length; T < w; T++) {
        const A = h[T], L = l[T], b = d[T], S = p[T], N = g[T];
        if (A === void 0)
          continue;
        A.updateMatrix();
        let P;
        switch (v[N.path]) {
          case v.weights:
            P = on;
            break;
          case v.rotation:
            P = Be;
            break;
          case v.position:
          case v.scale:
          default:
            P = sn;
            break;
        }
        const D = A.name ? A.name : A.uuid, Y = S.interpolation !== void 0 ? Gn[S.interpolation] : it, V = [];
        v[N.path] === v.weights ? A.traverse(function(_) {
          _.morphTargetInfluences && V.push(_.name ? _.name : _.uuid);
        }) : V.push(D);
        let H = b.array;
        if (b.normalized) {
          const _ = Le(H.constructor), G = new Float32Array(H.length);
          for (let C = 0, $ = H.length; C < $; C++)
            G[C] = H[C] * _;
          H = G;
        }
        for (let _ = 0, G = V.length; _ < G; _++) {
          const C = new P(
            V[_] + "." + v[N.path],
            L.array,
            H,
            Y
          );
          S.interpolation === "CUBICSPLINE" && (C.createInterpolant = function(ue) {
            const oe = this instanceof Be ? jn : ct;
            return new oe(this.times, this.values, this.getValueSize() / 3, ue);
          }, C.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0), E.push(C);
        }
      }
      const m = e.name ? e.name : "animation_" + n;
      return new Yt(m, void 0, E);
    });
  }
  createNodeMesh(n) {
    const t = this.json, e = this, s = t.nodes[n];
    return s.mesh === void 0 ? null : e.getDependency("mesh", s.mesh).then(function(o) {
      const r = e._getNodeRef(e.meshCache, s.mesh, o);
      return s.weights !== void 0 && r.traverse(function(a) {
        if (a.isMesh)
          for (let i = 0, c = s.weights.length; i < c; i++)
            a.morphTargetInfluences[i] = s.weights[i];
      }), r;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#nodes-and-hierarchy
   * @param {number} nodeIndex
   * @return {Promise<Object3D>}
   */
  loadNode(n) {
    const t = this.json, e = this.extensions, s = this, o = t.nodes[n], r = o.name ? s.createUniqueName(o.name) : "";
    return function() {
      const a = [], i = s._invokeOne(function(d) {
        return d.createNodeMesh && d.createNodeMesh(n);
      });
      i && a.push(i), o.camera !== void 0 && a.push(s.getDependency("camera", o.camera).then(function(d) {
        return s._getNodeRef(s.cameraCache, o.camera, d);
      })), s._invokeAll(function(d) {
        return d.createNodeAttachment && d.createNodeAttachment(n);
      }).forEach(function(d) {
        a.push(d);
      });
      const c = [], h = o.children || [];
      for (let d = 0, p = h.length; d < p; d++)
        c.push(s.getDependency("node", h[d]));
      const l = o.skin === void 0 ? Promise.resolve(null) : s.getDependency("skin", o.skin);
      return Promise.all([
        Promise.all(a),
        Promise.all(c),
        l
      ]);
    }().then(function(a) {
      const i = a[0], c = a[1], h = a[2];
      let l;
      if (o.isBone === !0 ? l = new Wt() : i.length > 1 ? l = new ie() : i.length === 1 ? l = i[0] : l = new tt(), l !== i[0])
        for (let d = 0, p = i.length; d < p; d++)
          l.add(i[d]);
      if (o.name && (l.userData.name = o.name, l.name = r), K(l, o), o.extensions && te(e, l, o), o.matrix !== void 0) {
        const d = new le();
        d.fromArray(o.matrix), l.applyMatrix4(d);
      } else
        o.translation !== void 0 && l.position.fromArray(o.translation), o.rotation !== void 0 && l.quaternion.fromArray(o.rotation), o.scale !== void 0 && l.scale.fromArray(o.scale);
      s.associations.has(l) || s.associations.set(l, {}), s.associations.get(l).nodes = n, h !== null && l.traverse(function(d) {
        d.isSkinnedMesh && d.bind(h, Xn);
      });
      for (let d = 0, p = c.length; d < p; d++)
        l.add(c[d]);
      return l;
    });
  }
  /**
   * Specification: https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#scenes
   * @param {number} sceneIndex
   * @return {Promise<Group>}
   */
  loadScene(n) {
    const t = this.extensions, e = this.json.scenes[n], s = this, o = new ie();
    e.name && (o.name = s.createUniqueName(e.name)), K(o, e), e.extensions && te(t, o, e);
    const r = e.nodes || [], a = [];
    for (let i = 0, c = r.length; i < c; i++)
      a.push(s.getDependency("node", r[i]));
    return Promise.all(a).then(function(i) {
      for (let h = 0, l = i.length; h < l; h++)
        o.add(i[h]);
      const c = (h) => {
        const l = /* @__PURE__ */ new Map();
        for (const [d, p] of s.associations)
          (d instanceof pe || d instanceof Ke) && l.set(d, p);
        return h.traverse((d) => {
          const p = s.associations.get(d);
          p != null && l.set(d, p);
        }), l;
      };
      return s.associations = c(o), o;
    });
  }
}
function Wn(f, n, t) {
  const e = n.attributes, s = new rn();
  if (e.POSITION !== void 0) {
    const a = t.json.accessors[e.POSITION], i = a.min, c = a.max;
    if (i !== void 0 && c !== void 0) {
      if (s.set(
        new O(i[0], i[1], i[2]),
        new O(c[0], c[1], c[2])
      ), a.normalized) {
        const h = Le(Q[a.componentType]);
        s.min.multiplyScalar(h), s.max.multiplyScalar(h);
      }
    } else {
      console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      return;
    }
  } else
    return;
  const o = n.targets;
  if (o !== void 0) {
    const a = new O(), i = new O();
    for (let c = 0, h = o.length; c < h; c++) {
      const l = o[c];
      if (l.POSITION !== void 0) {
        const d = t.json.accessors[l.POSITION], p = d.min, g = d.max;
        if (p !== void 0 && g !== void 0) {
          if (i.setX(Math.max(Math.abs(p[0]), Math.abs(g[0]))), i.setY(Math.max(Math.abs(p[1]), Math.abs(g[1]))), i.setZ(Math.max(Math.abs(p[2]), Math.abs(g[2]))), d.normalized) {
            const E = Le(Q[d.componentType]);
            i.multiplyScalar(E);
          }
          a.max(i);
        } else
          console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
      }
    }
    s.expandByVector(a);
  }
  f.boundingBox = s;
  const r = new an();
  s.getCenter(r.center), r.radius = s.min.distanceTo(s.max) / 2, f.boundingSphere = r;
}
function Qe(f, n, t) {
  const e = n.attributes, s = [];
  function o(r, a) {
    return t.getDependency("accessor", r).then(function(i) {
      f.setAttribute(a, i);
    });
  }
  for (const r in e) {
    const a = we[r] || r.toLowerCase();
    a in f.attributes || s.push(o(e[r], a));
  }
  if (n.indices !== void 0 && !f.index) {
    const r = t.getDependency("accessor", n.indices).then(function(a) {
      f.setIndex(a);
    });
    s.push(r);
  }
  return K(f, n), Wn(f, n, t), Promise.all(s).then(function() {
    return n.targets !== void 0 ? Kn(f, n.targets, t) : f;
  });
}
const Ee = /* @__PURE__ */ new WeakMap();
class qn extends $e {
  constructor(n) {
    super(n), this.decoderPath = "", this.decoderConfig = {}, this.decoderBinary = null, this.decoderPending = null, this.workerLimit = 4, this.workerPool = [], this.workerNextTaskID = 1, this.workerSourceURL = "", this.defaultAttributeIDs = {
      position: "POSITION",
      normal: "NORMAL",
      color: "COLOR",
      uv: "TEX_COORD"
    }, this.defaultAttributeTypes = {
      position: "Float32Array",
      normal: "Float32Array",
      color: "Float32Array",
      uv: "Float32Array"
    };
  }
  setDecoderPath(n) {
    return this.decoderPath = n, this;
  }
  setDecoderConfig(n) {
    return this.decoderConfig = n, this;
  }
  setWorkerLimit(n) {
    return this.workerLimit = n, this;
  }
  load(n, t, e, s) {
    const o = new ce(this.manager);
    o.setPath(this.path), o.setResponseType("arraybuffer"), o.setRequestHeader(this.requestHeader), o.setWithCredentials(this.withCredentials), o.load(n, (r) => {
      this.decodeDracoFile(r, t).catch(s);
    }, e, s);
  }
  decodeDracoFile(n, t, e, s) {
    const o = {
      attributeIDs: e || this.defaultAttributeIDs,
      attributeTypes: s || this.defaultAttributeTypes,
      useUniqueIDs: !!e
    };
    return this.decodeGeometry(n, o).then(t);
  }
  decodeGeometry(n, t) {
    const e = JSON.stringify(t);
    if (Ee.has(n)) {
      const i = Ee.get(n);
      if (i.key === e)
        return i.promise;
      if (n.byteLength === 0)
        throw new Error(
          "THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred."
        );
    }
    let s;
    const o = this.workerNextTaskID++, r = n.byteLength, a = this._getWorker(o, r).then((i) => (s = i, new Promise((c, h) => {
      s._callbacks[o] = { resolve: c, reject: h }, s.postMessage({ type: "decode", id: o, taskConfig: t, buffer: n }, [n]);
    }))).then((i) => this._createGeometry(i.geometry));
    return a.catch(() => !0).then(() => {
      s && o && this._releaseTask(s, o);
    }), Ee.set(n, {
      key: e,
      promise: a
    }), a;
  }
  _createGeometry(n) {
    const t = new ot();
    n.index && t.setIndex(new se(n.index.array, 1));
    for (let e = 0; e < n.attributes.length; e++) {
      const s = n.attributes[e], o = s.name, r = s.array, a = s.itemSize;
      t.setAttribute(o, new se(r, a));
    }
    return t;
  }
  _loadLibrary(n, t) {
    const e = new ce(this.manager);
    return e.setPath(this.decoderPath), e.setResponseType(t), e.setWithCredentials(this.withCredentials), new Promise((s, o) => {
      e.load(n, s, void 0, o);
    });
  }
  preload() {
    return this._initDecoder(), this;
  }
  _initDecoder() {
    if (this.decoderPending)
      return this.decoderPending;
    const n = typeof WebAssembly != "object" || this.decoderConfig.type === "js", t = [];
    return n ? t.push(this._loadLibrary("draco_decoder.js", "text")) : (t.push(this._loadLibrary("draco_wasm_wrapper.js", "text")), t.push(this._loadLibrary("draco_decoder.wasm", "arraybuffer"))), this.decoderPending = Promise.all(t).then((e) => {
      const s = e[0];
      n || (this.decoderConfig.wasmBinary = e[1]);
      const o = Zn.toString(), r = [
        "/* draco decoder */",
        s,
        "",
        "/* worker */",
        o.substring(o.indexOf("{") + 1, o.lastIndexOf("}"))
      ].join(`
`);
      this.workerSourceURL = URL.createObjectURL(new Blob([r]));
    }), this.decoderPending;
  }
  _getWorker(n, t) {
    return this._initDecoder().then(() => {
      if (this.workerPool.length < this.workerLimit) {
        const s = new Worker(this.workerSourceURL);
        s._callbacks = {}, s._taskCosts = {}, s._taskLoad = 0, s.postMessage({ type: "init", decoderConfig: this.decoderConfig }), s.onmessage = function(o) {
          const r = o.data;
          switch (r.type) {
            case "decode":
              s._callbacks[r.id].resolve(r);
              break;
            case "error":
              s._callbacks[r.id].reject(r);
              break;
            default:
              console.error('THREE.DRACOLoader: Unexpected message, "' + r.type + '"');
          }
        }, this.workerPool.push(s);
      } else
        this.workerPool.sort(function(s, o) {
          return s._taskLoad > o._taskLoad ? -1 : 1;
        });
      const e = this.workerPool[this.workerPool.length - 1];
      return e._taskCosts[n] = t, e._taskLoad += t, e;
    });
  }
  _releaseTask(n, t) {
    n._taskLoad -= n._taskCosts[t], delete n._callbacks[t], delete n._taskCosts[t];
  }
  debug() {
    console.log("Task load: ", this.workerPool.map((n) => n._taskLoad));
  }
  dispose() {
    for (let n = 0; n < this.workerPool.length; ++n)
      this.workerPool[n].terminate();
    return this.workerPool.length = 0, this.workerSourceURL !== "" && URL.revokeObjectURL(this.workerSourceURL), this;
  }
}
function Zn() {
  let f, n;
  onmessage = function(r) {
    const a = r.data;
    switch (a.type) {
      case "init":
        f = a.decoderConfig, n = new Promise(function(h) {
          f.onModuleLoaded = function(l) {
            h({ draco: l });
          }, DracoDecoderModule(f);
        });
        break;
      case "decode":
        const i = a.buffer, c = a.taskConfig;
        n.then((h) => {
          const l = h.draco, d = new l.Decoder(), p = new l.DecoderBuffer();
          p.Init(new Int8Array(i), i.byteLength);
          try {
            const g = t(l, d, p, c), E = g.attributes.map((m) => m.array.buffer);
            g.index && E.push(g.index.array.buffer), self.postMessage({ type: "decode", id: a.id, geometry: g }, E);
          } catch (g) {
            console.error(g), self.postMessage({ type: "error", id: a.id, error: g.message });
          } finally {
            l.destroy(p), l.destroy(d);
          }
        });
        break;
    }
  };
  function t(r, a, i, c) {
    const h = c.attributeIDs, l = c.attributeTypes;
    let d, p;
    const g = a.GetEncodedGeometryType(i);
    if (g === r.TRIANGULAR_MESH)
      d = new r.Mesh(), p = a.DecodeBufferToMesh(i, d);
    else if (g === r.POINT_CLOUD)
      d = new r.PointCloud(), p = a.DecodeBufferToPointCloud(i, d);
    else
      throw new Error("THREE.DRACOLoader: Unexpected geometry type.");
    if (!p.ok() || d.ptr === 0)
      throw new Error("THREE.DRACOLoader: Decoding failed: " + p.error_msg());
    const E = { index: null, attributes: [] };
    for (const m in h) {
      const T = self[l[m]];
      let w, A;
      if (c.useUniqueIDs)
        A = h[m], w = a.GetAttributeByUniqueId(d, A);
      else {
        if (A = a.GetAttributeId(d, r[h[m]]), A === -1)
          continue;
        w = a.GetAttribute(d, A);
      }
      E.attributes.push(s(r, a, d, m, T, w));
    }
    return g === r.TRIANGULAR_MESH && (E.index = e(r, a, d)), r.destroy(d), E;
  }
  function e(r, a, i) {
    const h = i.num_faces() * 3, l = h * 4, d = r._malloc(l);
    a.GetTrianglesUInt32Array(i, l, d);
    const p = new Uint32Array(r.HEAPF32.buffer, d, h).slice();
    return r._free(d), { array: p, itemSize: 1 };
  }
  function s(r, a, i, c, h, l) {
    const d = l.num_components(), g = i.num_points() * d, E = g * h.BYTES_PER_ELEMENT, m = o(r, h), T = r._malloc(E);
    a.GetAttributeDataArrayForAllPoints(i, l, m, E, T);
    const w = new h(r.HEAPF32.buffer, T, g).slice();
    return r._free(T), {
      name: c,
      array: w,
      itemSize: d
    };
  }
  function o(r, a) {
    switch (a) {
      case Float32Array:
        return r.DT_FLOAT32;
      case Int8Array:
        return r.DT_INT8;
      case Int16Array:
        return r.DT_INT16;
      case Int32Array:
        return r.DT_INT32;
      case Uint8Array:
        return r.DT_UINT8;
      case Uint16Array:
        return r.DT_UINT16;
      case Uint32Array:
        return r.DT_UINT32;
    }
  }
}
const lt = "https://foretoo.github.io/narkomfin", _e = new ln(), ut = new qn(_e);
ut.setDecoderPath(lt + "/public/vendors/");
const dt = new yn(_e);
dt.setDRACOLoader(ut);
const Qn = (f, n, t, e) => (_e.itemStart = (s) => void (/^data:/.test(s) && e && e()), new Promise((s) => {
  dt.load(
    lt + `/public/${f}.gltf`,
    s,
    n,
    t
  );
})), Jn = (...f) => f.reduce(
  (n, t) => n + Math.abs(t),
  Math.abs(f.pop() || 0)
), $n = (f, n = 1, t = 3e-3) => {
  const e = new I(), s = new I();
  let o = !1, r = 0;
  const a = () => {
    const i = performance.now(), c = (i - r) * 1e-3 * n, h = e.x - s.x, l = e.y - s.y;
    s.x += h * c, s.y += l * c, r = i, f(s), Jn(h, l) > t ? requestAnimationFrame(a) : o = !1;
  };
  addEventListener("pointermove", (i) => {
    e.x = i.clientX / innerWidth - 0.5, e.y = -i.clientY / innerHeight + 0.5, !o && (o = !0, r = performance.now(), requestAnimationFrame(a));
  });
}, es = () => {
  const f = new un();
  f.background = new B(Tn);
  const n = new xe(60, innerWidth / innerHeight, 0.1, 100), t = new dn({ antialias: !0 });
  return t.setSize(innerWidth, innerHeight), t.setPixelRatio(Math.min(devicePixelRatio, 2)), t.outputEncoding = J, t.toneMapping = hn, t.shadowMap.enabled = !0, t.shadowMap.type = fn, window.addEventListener("resize", () => {
    n.aspect = innerWidth / innerHeight, n.updateProjectionMatrix(), t.setSize(innerWidth, innerHeight);
  }), {
    scene: f,
    camera: n,
    renderer: t
  };
}, ts = new z(), ns = (f) => {
  const n = f.scene, t = Array(3).fill(0.075), e = new ie();
  return n.traverse((s) => {
    if (!(s instanceof rt))
      return;
    const o = s.clone();
    switch (o.geometry.scale(...t), o.castShadow = !0, o.receiveShadow = !0, o.frustumCulled = !1, o.material = ts, o.name) {
      case "walls":
      case "floors":
        o.material = new z({ color: 14540253 });
        break;
      case "doors":
      case "base":
      case "glass":
        o.material = new z({ color: 8947848 });
        break;
      case "plants":
      case "lounger":
      case "yard":
      case "base002":
      case "thing":
        o.material = new z({ color: 5592405 });
        break;
      case "columns":
      case "borders":
      case "metal":
        o.material = new z({ color: 3355443 });
        break;
    }
    e.add(o);
  }), e;
}, os = (f) => {
  const n = f.querySelector(".narkomfin-progress-label"), { scene: t, camera: e, renderer: s } = es();
  Qn(
    "narkom_compressed1",
    (c) => {
      n.textContent = ge.LOADING + ` ${c.loaded / gn * 100 | 0}%`;
    },
    () => {
      n.textContent = ge.ERROR;
    },
    () => {
      n.textContent = ge.DECODING;
    }
  ).then((c) => {
    f.replaceChild(s.domElement, n), t.add(ns(c));
  });
  const o = new xe(), r = new mn(o, s.domElement);
  o.position.set(1, 3, 6), o.add(e), t.add(o), $n((c) => {
    e.position.x = -c.x, e.position.y = -c.y, e.lookAt(t.position);
  }, 5);
  const a = new pn(10057557, 5601177, 0.5);
  t.add(a);
  const i = new et(16777215, 0.75);
  i.position.set(2, 3, 4), i.castShadow = !0, i.shadow.mapSize = new I(1024, 1024).multiplyScalar(4), i.shadow.camera.far = i.position.length() + o.position.length() + 4.5, i.shadow.bias = -1e-3, o.add(i), s.setAnimationLoop(() => {
    r.update(), s.render(t, e);
  });
};
export {
  os as init
};

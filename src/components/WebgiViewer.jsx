import React, { useRef, useState, useCallback, forwardRef, useImperativeHandle, useEffect } from 'react'
import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,

  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  BloomPlugin,
  AnisotropyPlugin,
  GammaCorrectionPlugin,

  addBasePlugins,
  CanvasSnipperPlugin,
  mobileAndTabletCheck
} from "webgi";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
const WebgiViewer = () => {
  const canvasRef = useRef(null);

  const setupViewer = useCallback(async () => {
    // Initialize the viewer
    const viewer = new ViewerApp({
      canvas: canvasRef.current,
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin);

    const camera = camera.scene.activeCamera;
    const position = camera.position;
    const target = camera.target;

    // Add a popup(in HTML) with download progress when any asset is downloading.
    // await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // Add plugins individually.
    await viewer.addPlugin(GBufferPlugin)
    await viewer.addPlugin(new ProgressivePlugin(32))
    await viewer.addPlugin(new TonemapPlugin(true))
    await viewer.addPlugin(GammaCorrectionPlugin)
    await viewer.addPlugin(SSRPlugin)
    await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(DiamondPlugin)
    // await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    // await viewer.addPlugin(GroundPlugin)
    await viewer.addPlugin(BloomPlugin)
    // await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)

    // or use this to add all main ones at once.
    //await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    //await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    await manager.addFromPath("scene-black.glb")

    viewer.getPlugin(TonemapPlugin).config.clipBackground = true;

    // Load an environment map if not set in the glb file
    // await viewer.scene.setEnvironment(
    //     await manager.importer!.importSinglePath<ITexture>(
    //         "./assets/environment.hdr"
    //     )
    // );

    // Add some UI for tweak and testing.
    // const uiPlugin = await viewer.addPlugin(TweakpaneUiPlugin)
    // // Add plugins to the UI to see their settings.
    // uiPlugin.setupPlugins < IViewerPlugin > (TonemapPlugin, CanvasSnipperPlugin)

    viewer.scene.activeCamera.setCameraOptions({ controlsEnabled: false });
    window.scrollTo(0, 0);

    let needsUpdate = true;
    viewer.addEventListener("preFrame", () => {
      if (needsUpdate) {


        camera.positionTargetUpdated(true);
        needsUpdate = false
      }
    })

  }, []);

  useEffect(() => {
    setupViewer()
  }, [])

  return (
    <div id="webgi-canvas-container">
      <canvas className="webgi-canvas" ref={canvasRef}>

      </canvas>
    </div>
  )
}

export default WebgiViewer
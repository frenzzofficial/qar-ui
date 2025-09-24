import CameraApp from "@/components/context/camera-app/CameraApp";
import { CameraProvider } from "@/components/provider/CameraProvider";

export default function Home() {
  return (
    <section>
      <CameraProvider>
        <CameraApp />
      </CameraProvider>
    </section>
  );
}

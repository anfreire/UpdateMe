import "@/src/index.css";
import Carousel from "./components/carousel";

export default function Cinema() {
  return (
    <div className="smart-x-padding flex h-screen-no-navbar w-full flex-col items-center justify-between">
      <Carousel />
    </div>
  );
}

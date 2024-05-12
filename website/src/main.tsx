import { NextUIProvider } from "@nextui-org/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";
import "./index.css";
import { Suspense, lazy } from "react";

const DynamicApp = lazy(() => import("./App.tsx"));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <RecoilRoot>
    <NextUIProvider>
      <ThemeProvider attribute="class" defaultTheme="dark">
        <BrowserRouter>
          <Suspense>
            <DynamicApp />
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </NextUIProvider>
  </RecoilRoot>,
);

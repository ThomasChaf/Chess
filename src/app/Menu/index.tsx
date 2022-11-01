import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import { XButton } from "common/button";
import { AnimatedLayout, AnimatedLayoutRef } from "common/animatedLayout";

import "./menu.scss";

export const Menu = () => {
  const layoutRef = useRef<AnimatedLayoutRef>(null);
  const navigate = useNavigate();

  const redirect = (path: string) => {
    layoutRef.current?.close();
    navigate(path);
  };

  const openMenu = () => layoutRef.current?.open();

  return (
    <>
      <span onClick={openMenu} className="menu-icon material-icons">
        menu
      </span>

      <AnimatedLayout ref={layoutRef}>
        <div className="menu-box">
          <p className="menu-headline">Menu</p>
          <div className="menu-content">
            <XButton onClick={() => redirect("/chess")} next>
              Chess
            </XButton>
            <br />
            <XButton onClick={() => redirect("/2048")} next>
              2048
            </XButton>
          </div>
        </div>
      </AnimatedLayout>
    </>
  );
};

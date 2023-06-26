import React from "react";
import Canvas from "./Canvas";
import SettingBar from "./SettingBar";
import Toolbar from "./Toolbar";

const Content = () => {
    return (
        <>
            <Toolbar/>
            <SettingBar/>
            <Canvas/>
        </>
    )
}

export default Content
import React from "react";
import toolState from "../store/toolState";

const SettingBar = () => {
    return (
        <div className="settingbar">
            <div className="settingbar__item">
                <label htmlFor="line-width">Толщина линии</label>
                <input 
                    onChange={e => toolState.setWidth(e.target.value)}
                    type="number" 
                    className="settingbar__item_input-number"
                    min={1}
                    max={50}
                    defaultValue={1}
                    id="line-width"/>
            </div>
            <div className="settingbar__item">
                <label htmlFor="stroke-color">Цвет обводки</label>
                <input 
                    type="color"
                    id="stroke-color"
                    onChange={e => toolState.setStrokeColor(e.target.value)} />
            </div>
        </div>
    )
}

export default SettingBar
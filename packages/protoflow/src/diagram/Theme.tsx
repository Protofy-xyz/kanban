import React, { useContext } from 'react';
import { FlowStoreContext } from "../store/FlowsStore"
import NodeTypes from '../nodes';
import convert from 'color-convert'
import { colord } from "colord";
import { generateBoxShadow } from '../lib/shadow';

type themeKey = "edgeColor" | "nodeBackgroundColor" | "inputBackgroundColor" | "textColor" | "interactiveColor" | 'interactiveHoverColor' | 'inputBorder' | 'borderColor'
    | 'borderWidth' | 'borderWidthSelected' | 'colorError' | 'handleBorderColor' | 'flowOutputColor' | 'dataOutputColor' | 'highlightInputBackgroundColor' | 'blockPort' | 'flowPort'
    | 'dataPort' | 'nodeBorderWidth' | 'nodeBorderColor' | 'portSize' | 'nodeFontSize' | 'containerColor' | 'titleColor' | 'disableTextColor' | 'nodeEdgeWidth' | 'nodeEdgeStyle'
    | 'plusColor' | 'selectedColor' | 'separatorColor' | 'nodePalette' | 'borderColorSelected' | 'borderRadiusSelected' | 'boxShadowSelected' | 'menuBackground'

const commonVars: any = {
    nodeBorderWidth: '1px',
    nodeFontSize: 12,
    nodeEdgeWidth: 3,
    nodeEdgeStyle: "7 5"
}
commonVars.portSize = 10
commonVars.borderWidth = '1px'
commonVars.borderWidthSelected = 0
commonVars.borderRadiusSelected = 6

const outlineColorLight = '#222'
const outlineColorDark = '#888'


const Theme = {
    light: {
        ...commonVars,
        nodePalette: {
            gamut: {
                hue: 20,
                saturation: 30,
                value: 90
            },
            custom: {

            }
        },
        plusColor: '#999',
        edgeColor: '#888',
        nodeBackgroundColor: "#fdfdfd",
        inputBackgroundColor: "white",
        inputBorder: '1px solid #ccc',
        textColor: "#666",
        selectedColor: "#2680EB",
        disableTextColor: "#ccc",
        interactiveColor: "#4fc2f7",
        interactiveHoverColor: 'rgba(79, 194, 247, 0.1)',
        borderColor: '#888',
        colorError: '#EF4444',
        handleBorderColor: 'white',
        flowOutputColor: 'white',
        dataOutputColor: '#AAA',
        highlightInputBackgroundColor: '#F1F1F1',
        blockPort: '#AAA',
        flowPort: '#fefefe',
        dataPort: '#fefefe',
        nodeBorderColor: '#aaa',
        titleColor: '#333',
        containerColor: '#00000005',
        separatorColor: '#D4D4D4',
        borderColorSelected: '#222',
        boxShadowSelected: '',//generateBoxShadow(12)
        menuBackground: '#FFFFF60'
    },
    dark: {
        ...commonVars,
        nodePalette: {
            gamut: {
                hue: 20,
                saturation: 60,
                value: 90
            },
            custom: {

            }
        },
        plusColor: 'white',
        handleBorderColor: 'black',
        edgeColor: outlineColorDark,
        nodeBackgroundColor: "#303030", //bg of nodes
        inputBackgroundColor: "#404040",
        inputBorder: '0',
        textColor: "#e5e5e5",
        selectedColor: "#2680EB",
        disableTextColor: "grey",
        interactiveColor: "#4772b3",
        interactiveHoverColor: '#252525',
        borderColor: outlineColorDark,
        colorError: '#EF4444',
        flowOutputColor: '#CCC',
        dataOutputColor: '#666',
        highlightInputBackgroundColor: "#222222",
        blockPort: '#666',
        flowPort: '#CCC',
        dataPort: '#CCC',
        nodeBorderColor: outlineColorDark,
        titleColor: '#000000EE',
        containerColor: '#FFFFFF05',
        separatorColor: '#424242',
        borderColorSelected: 'white',
        boxShadowSelected: '',//generateBoxShadow(15, 255, 255, 255)
        menuBackground: '#44444460'
    }
}

const useTheme = (key: themeKey, defaultValue = null) => {
    const useFlowsStore = useContext(FlowStoreContext)
    const themeMode = useFlowsStore(state => state.themeMode)
    const themeOverride = useFlowsStore(state => state.themeOverride)
    const _theme = { ...Theme[themeMode], ...themeOverride }
    try {
        const value = _theme[key] ?? defaultValue
        return value
    } catch (e) {
        return defaultValue
    }

}
const keys = Object.keys(NodeTypes)
const totalKeys = keys.length
const generateColor = (type: string, gamut: { hue: number, saturation: number, value: number }, index?) => {
    try {
        const i = Math.max(typeof type !== "undefined" ? keys.indexOf(type) : index, 0)
        const h = (100 * (totalKeys / (i + 1))) + gamut?.hue % 100
        const hex = convert?.hsv?.hex ? convert.hsv.hex(h, gamut?.saturation, gamut?.value) : '000000'
        return "#" + hex
    } catch (e) {
        console.error('Error generating color:', e)
        return '#000000'
    }

}

export const generateColorbyIndex = (index, arrLength) => {
    const nodePalette = useTheme('nodePalette', {})
    const gamut = nodePalette.gamut
    var i = index < 0 ? 0 : index

    const h = (100 * (arrLength / (i + 1))) + gamut.hue % 100
    return "#" + convert.hsv.hex(h, gamut.saturation, gamut.value)
}

export const useNodeColor = (type?) => {
    //NodeTypes
    
    const nodePalette = useTheme('nodePalette', {})
    return type && nodePalette?.custom && nodePalette?.custom[type] ? nodePalette.custom[type] : generateColor(type, nodePalette.gamut) //nodePalette.colors[Object.keys(NodeTypes).indexOf(type) % nodePalette.colors.length]
}

export const useColorFromPalette = (index) => {
    const nodePalette = useTheme('nodePalette', {})
    return generateColor(undefined, nodePalette.gamut, index)
}

export const usePrimaryColor = () => {
    const nodePalette = useTheme('nodePalette', {})
    const useFlowsStore = useContext(FlowStoreContext)
    const primaryColor = useFlowsStore(state => state.primaryColor)
    const themeMode = useFlowsStore(state => state.themeMode)
    if (themeMode == 'dark') {
        return '#' + convert.hsv.hex(colord(primaryColor).hue(), nodePalette?.gamut?.saturation - 10, nodePalette?.gamut?.value + 5)
    } else {
        return '#' + convert.hsv.hex(colord(primaryColor).hue(), nodePalette?.gamut?.saturation, nodePalette?.gamut?.value)
    }

}

export default useTheme
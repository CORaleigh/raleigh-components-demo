import FeatureLayer from "@arcgis/core/layers/FeatureLayer"
import Field from "@arcgis/core/layers/support/Field"
import WebMap from "@arcgis/core/WebMap"
import LayerSearchSource from "@arcgis/core/widgets/Search/LayerSearchSource"
export const getWebMapLayers = async (id: string) => {
    const webMap = new WebMap({
        portalItem: {
            id: id
        }
    })
    await webMap.load()
    const featureLayers = webMap.layers.filter(layer => layer.type === 'feature')
    return featureLayers
}

export const getLayerSearchSource = (field: Field, layer: FeatureLayer) => {
    return new LayerSearchSource({
        displayField: field.name,
        layer: layer,
        outFields: [field.name],
        placeholder: `Search by ${field.alias}`,
        minSuggestCharacters: 1
    })
}
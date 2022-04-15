import kebabCase from "lodash.kebabcase";

export const getDesignerGarmentIds = () => (state) =>
  state.designer.get("designerGarmentIds");
export const getDesignerInfoByName =
  (name, isEqualCheck = false) =>
  (state) =>
    state.designer
      .get("infoByDesignerId")
      .find((item) =>
        !isEqualCheck
          ? kebabCase(item.designerName) === name
          : item.designerName === name
      );
export const getCurrentResidentInfo = () => (state) => {
  const residentInfo = state.designer.get("residentInfo");
  return residentInfo
    ? Object.fromEntries(state.designer.get("residentInfo"))
    : {};
};
export const getIsLoading = () => (state) => state.designer.get("isLoading");

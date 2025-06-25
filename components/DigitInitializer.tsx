import React from "react";

interface Props {
  stateCode: string;
  enabledModules: string[];
  children: React.ReactNode;
}

const DigitInitializer: React.FC<Props> = ({ stateCode, enabledModules, children }) => {
  const { isLoading, data: initData } = window.Digit.Hooks.useInitStore(stateCode, enabledModules);
  console.log("initData", initData);
  const moduleCode = ["orders", "hearings", "common", "case", "workflow"];
  const language = window.Digit.StoreData.getCurrentLanguage();
  const { data: store } = window.Digit.Services.useStore({
    stateCode,
    moduleCode,
    language,
  });
  console.log("res:", store);

  

  if (isLoading) {
    return <div>Loading store...</div>;
  }

  return <>{children}</>;
};

export default DigitInitializer;
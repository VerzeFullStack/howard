import {
  ApplicationInsights,
  ITelemetryItem,
} from "@microsoft/applicationinsights-web";
import { ReactPlugin } from "@microsoft/applicationinsights-react-js";

const reactPlugin = new ReactPlugin();
const appInsights = new ApplicationInsights({
  config: {
    connectionString:
      "InstrumentationKey=d0626b42-b7ec-46b6-a9bc-ae036ce14405;IngestionEndpoint=https://eastus-8.in.applicationinsights.azure.com/;LiveEndpoint=https://eastus.livediagnostics.monitor.azure.com/;ApplicationId=c108addb-500f-44af-8f68-b1df04798318",
    extensions: [reactPlugin],
    enableAutoRouteTracking: true,
    disableAjaxTracking: false,
    autoTrackPageVisitTime: true,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
  },
});
appInsights.loadAppInsights();

appInsights.addTelemetryInitializer((env: ITelemetryItem) => {
  env.tags = env.tags || [];
  env.tags["ai.cloud.role"] = "testTag";
});

export { reactPlugin, appInsights };

const { withGradleProperties } = require('@expo/config-plugins');

function withKotlinGradle(config, version) {
  return withGradleProperties(config, config => {
    console.log(
      `[config-plugins/kotlin-version] Setting android.kotlinVersion to: ${version}. This could lead to Android build issues.`
    );
    config.modResults = setKotlinVersion(config.modResults, version);
    return config;
  });
}

function setKotlinVersion(gradleProperties, version) {
  const updatedProps = [...gradleProperties];
  updatedProps.push({
    type: 'property',
    key: 'kotlinVersion',
    value: version,
  });
  return updatedProps;
}

module.exports = withKotlinGradle;
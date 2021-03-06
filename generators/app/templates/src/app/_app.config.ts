/** @ngInject */
export function config($logProvider: angular.ILogProvider) {
  // enable log
  $logProvider.debugEnabled(true);
}

/** @ngInject */
<% if (props.languageSupport) { -%>
export function configTranslations($translateProvider: angular.ITranslateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/translations/',
        suffix: '.json'
    }).determinePreferredLanguage();

    $translateProvider.useSanitizeValueStrategy('escapeParameters');

    // Get users preferred language and extract the "relevant" part
    var language = $translateProvider.preferredLanguage();
    language = language.split('_')[0];

    // Languages that we support
    var supportedLanguages = ['sv', 'en'];

    // If we support user's preferred language, then use it. Otherwise, use English.
    language = (supportedLanguages.indexOf(language) !== -1) ? language : 'en';

    $translateProvider.preferredLanguage(language);
    moment().locale(language);
}
<% } -%>

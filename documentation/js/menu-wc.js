'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">music-education-interface-ionic documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#components-links"' :
                            'data-bs-target="#xs-components-links"' }>
                            <span class="icon ion-md-cog"></span>
                            <span>Components</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="components-links"' : 'id="xs-components-links"' }>
                            <li class="link">
                                <a href="components/AppComponent.html" data-type="entity-link" >AppComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ChromaticTunerComponent.html" data-type="entity-link" >ChromaticTunerComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/HomePage.html" data-type="entity-link" >HomePage</a>
                            </li>
                            <li class="link">
                                <a href="components/NoteSelectorComponent.html" data-type="entity-link" >NoteSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/PitchComponent.html" data-type="entity-link" >PitchComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ProfilePage.html" data-type="entity-link" >ProfilePage</a>
                            </li>
                            <li class="link">
                                <a href="components/RegisterPage.html" data-type="entity-link" >RegisterPage</a>
                            </li>
                            <li class="link">
                                <a href="components/ScoreViewComponent.html" data-type="entity-link" >ScoreViewComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/ScrollImageComponent.html" data-type="entity-link" >ScrollImageComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SemaphoreLightComponent.html" data-type="entity-link" >SemaphoreLightComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/SigninPage.html" data-type="entity-link" >SigninPage</a>
                            </li>
                            <li class="link">
                                <a href="components/SignupPage.html" data-type="entity-link" >SignupPage</a>
                            </li>
                            <li class="link">
                                <a href="components/TabsComponent.html" data-type="entity-link" >TabsComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TempoSelectorComponent.html" data-type="entity-link" >TempoSelectorComponent</a>
                            </li>
                            <li class="link">
                                <a href="components/TrumpetDiagramComponent.html" data-type="entity-link" >TrumpetDiagramComponent</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BeatService.html" data-type="entity-link" >BeatService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FirebaseService.html" data-type="entity-link" >FirebaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PitchService.html" data-type="entity-link" >PitchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RefFreqService.html" data-type="entity-link" >RefFreqService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/SoundsService.html" data-type="entity-link" >SoundsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TabsService.html" data-type="entity-link" >TabsService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
# Changelog

## [1.3.2](https://github.com/jburns24/five31/compare/v1.3.1...v1.3.2) (2026-04-25)


### Bug Fixes

* **ci:** switch release-please to manifest mode so extra-files runs ([#41](https://github.com/jburns24/five31/issues/41)) ([ac87cf7](https://github.com/jburns24/five31/commit/ac87cf7d33a964333f817f8c57e1d30eb2666843))

## [1.3.1](https://github.com/jburns24/five31/compare/v1.3.0...v1.3.1) (2026-04-25)


### Bug Fixes

* respect explicit workout selection instead of always redirecting to first incomplete ([#39](https://github.com/jburns24/five31/issues/39)) ([6c643c8](https://github.com/jburns24/five31/commit/6c643c823510e4aa9a9851e65fcb50ba9bc44a82))

## [1.3.0](https://github.com/jburns24/five31/compare/v1.2.9...v1.3.0) (2026-04-25)


### Features

* Install OpenTelemetry SDK and configure auto-instrumentation ([#36](https://github.com/jburns24/five31/issues/36)) ([836e0f9](https://github.com/jburns24/five31/commit/836e0f9649d3d8f3f5dc7a8df52b43e189d450ad))

## [1.2.9](https://github.com/jburns24/five31/compare/v1.2.8...v1.2.9) (2025-12-31)


### Bug Fixes

* **ci:** removed sts trust policy and reverted back to built in token ([#34](https://github.com/jburns24/five31/issues/34)) ([9954ece](https://github.com/jburns24/five31/commit/9954ece9833931533c1ed6f8a809637e94893fab))

## [1.2.8](https://github.com/jburns24/five31/compare/v1.2.7...v1.2.8) (2025-12-31)


### Bug Fixes

* **ci:** change sts policy back to repo level permission after associ… ([#32](https://github.com/jburns24/five31/issues/32)) ([26e40e6](https://github.com/jburns24/five31/commit/26e40e695f8d0e44ce34869d9508347bfd28b553))

## [1.2.7](https://github.com/jburns24/five31/compare/v1.2.6...v1.2.7) (2025-12-31)


### Bug Fixes

* **ci:** change away from octo-sts token to built in token ([#30](https://github.com/jburns24/five31/issues/30)) ([27073c5](https://github.com/jburns24/five31/commit/27073c587fa25af4a8c4bcdbcbfaaf5906b0fdb6))

## [1.2.6](https://github.com/jburns24/five31/compare/v1.2.5...v1.2.6) (2025-12-31)


### Bug Fixes

* **ci:** change sts policy back to repo level permission after associ… ([#28](https://github.com/jburns24/five31/issues/28)) ([d4f47d1](https://github.com/jburns24/five31/commit/d4f47d12b3a84a91d880025864fcecac0a60b9b0))

## [1.2.5](https://github.com/jburns24/five31/compare/v1.2.4...v1.2.5) (2025-12-31)


### Bug Fixes

* **ci:** change sts policy to use organization level permission ([#26](https://github.com/jburns24/five31/issues/26)) ([53dea78](https://github.com/jburns24/five31/commit/53dea78e734bf78521e3f01f91d10feaac09ae29))

## [1.2.4](https://github.com/jburns24/five31/compare/v1.2.3...v1.2.4) (2025-12-31)


### Bug Fixes

* update sts permissions to just 'packages' ([#23](https://github.com/jburns24/five31/issues/23)) ([267f730](https://github.com/jburns24/five31/commit/267f7309fe5e1ab3f5eb61b2fc3ce3bf8d90faad))

## [1.2.3](https://github.com/jburns24/five31/compare/v1.2.2...v1.2.3) (2025-12-31)


### Bug Fixes

* **ci:** fix sts permissions for build and push. Added comment to ref… ([#21](https://github.com/jburns24/five31/issues/21)) ([fde5b71](https://github.com/jburns24/five31/commit/fde5b71d941d40c0a26d981be8df9e739887b0d9))

## [1.2.2](https://github.com/jburns24/five31/compare/v1.2.1...v1.2.2) (2025-12-31)


### Bug Fixes

* correct typo in subject_pattern field ([#19](https://github.com/jburns24/five31/issues/19)) ([bced1d6](https://github.com/jburns24/five31/commit/bced1d6f0d0f6e2b4cafe309ba762dcc9c913bc6))

## [1.2.1](https://github.com/jburns24/five31/compare/v1.2.0...v1.2.1) (2025-12-31)


### Bug Fixes

* **ci:** update subject pattern for sts policy for build-and-push ([#17](https://github.com/jburns24/five31/issues/17)) ([b490023](https://github.com/jburns24/five31/commit/b4900232b90ce542db6c96565273c89540a02460))

## [1.2.0](https://github.com/jburns24/five31/compare/v1.1.1...v1.2.0) (2025-12-31)


### Features

* **ci:** add STS policies for GitHub Actions workflows release.yaml ([#15](https://github.com/jburns24/five31/issues/15)) ([aeb5842](https://github.com/jburns24/five31/commit/aeb5842e693065ce3de866501c8ccb3042aa2535))


### Bug Fixes

* remove claim_ref pattern from sts policy ([#14](https://github.com/jburns24/five31/issues/14)) ([5d21781](https://github.com/jburns24/five31/commit/5d21781fa63f190c65c46653ded284e2232386aa))
* update workflow claim pattern for sts token ([#13](https://github.com/jburns24/five31/issues/13)) ([31b4d92](https://github.com/jburns24/five31/commit/31b4d92e236021ee815bb9cfd2d6a63b0a37494d))

## [1.1.1](https://github.com/jburns24/five31/compare/v1.1.0...v1.1.1) (2025-12-31)


### Bug Fixes

* **ci:** add missing id-token write permission ([#11](https://github.com/jburns24/five31/issues/11)) ([6576c2c](https://github.com/jburns24/five31/commit/6576c2c455483d1673e5f68560673c2eba643b96))

## [1.1.0](https://github.com/jburns24/five31/compare/v1.0.3...v1.1.0) (2025-12-31)


### Features

* update STS trust policy for release-please ([#9](https://github.com/jburns24/five31/issues/9)) ([871bc40](https://github.com/jburns24/five31/commit/871bc408b9fc53765738a51fcc99028a9b1d2b09))

## [1.0.3](https://github.com/jburns24/five31/compare/v1.0.2...v1.0.3) (2025-12-31)


### Bug Fixes

* update the release workflow permissions to allow content writes ([#7](https://github.com/jburns24/five31/issues/7)) ([db86e37](https://github.com/jburns24/five31/commit/db86e37bbd5d4c5fdd14ee0355fe8c4e3da3fe70))

## [1.0.2](https://github.com/jburns24/five31/compare/v1.0.1...v1.0.2) (2025-12-31)


### Bug Fixes

* Update the dynamic route handlers to fix build errors ([e59bc49](https://github.com/jburns24/five31/commit/e59bc498ea1bfcb4e806e94ffc7ae3b921a60a71))
* Update the dynamic route handlers to fix build errors ([11ab5c5](https://github.com/jburns24/five31/commit/11ab5c5721e8cab77ca1361976fc457c142f0b24))

## [1.0.1](https://github.com/jburns24/five31/compare/v1.0.0...v1.0.1) (2025-12-31)


### Bug Fixes

* **ci:** checkout code before trying to build hoping this fixes permi… ([7caa438](https://github.com/jburns24/five31/commit/7caa438039d96149841c303cfc18f7a24d90e564))
* **ci:** checkout code before trying to build hoping this fixes permission issue ([cd65698](https://github.com/jburns24/five31/commit/cd6569839b660c7f27367df3c3c61cb582273e4f))

## 1.0.0 (2025-12-31)


### Features

* add 1RM progress chart with time filtering ([10d8507](https://github.com/jburns24/five31/commit/10d85077b729c011f6d24017a039241b68144b01))
* add AMRAP recording and PR detection system ([f7ff222](https://github.com/jburns24/five31/commit/f7ff222c5b32d20946237d840457ee236a3b642b))
* add auto-navigation and workout progression ([51fa928](https://github.com/jburns24/five31/commit/51fa9281399ffb186df0e6ba62a09a101973c5b9))
* add heaviest AMRAP records display ([e2a8593](https://github.com/jburns24/five31/commit/e2a859346a2e6782a2406d51cbcddc815199decd))
* add navigation header with logo and favicon ([d346cbd](https://github.com/jburns24/five31/commit/d346cbdeeaa42a8bf22f46050b7fc9994ae63cef))
* add navigation integration and single workout view ([4944b51](https://github.com/jburns24/five31/commit/4944b51407529fba3f4e129ae5f85c8b18b936c7))
* add set completion tracking with API integration ([58e8cb1](https://github.com/jburns24/five31/commit/58e8cb1b78610a1f946c90c7dd125447b165fd2b))
* add Stats page navigation and structure ([e0fd60c](https://github.com/jburns24/five31/commit/e0fd60c38ecfc7d802c1a15084578d430819e9b4))
* build workout generation API and user flow ([cf7fb8c](https://github.com/jburns24/five31/commit/cf7fb8c227fb73e08d717784fbbdf3cbfe26219c))
* **ci:** add workflows for semantic release ([2cc1386](https://github.com/jburns24/five31/commit/2cc13866b42fccfbc62c8826ac9fcfb0aa8e5b2a))
* **ci:** add workflows for semantic release ([a9a0085](https://github.com/jburns24/five31/commit/a9a00851cd4ae685c26c4a1bb5a20106c47b7c75))
* create User model with Mongoose schema and TypeScript types ([f9e1b6d](https://github.com/jburns24/five31/commit/f9e1b6dd25c857f62af8a147b981de2fa0396ace))
* create user profile page at /account ([2581fd3](https://github.com/jburns24/five31/commit/2581fd3e288a6ccd7cb82179d54b2fe09acee521))
* create workout display page ([b97c424](https://github.com/jburns24/five31/commit/b97c424e3ad924b4fe0e3136704cb96294f1d2f8))
* extend User model and create WorkoutPlan model ([910bf6e](https://github.com/jburns24/five31/commit/910bf6ea98fb3a0b1bdf2b262fd0ffe2a7660ca5))
* finish creating main page ([fc243af](https://github.com/jburns24/five31/commit/fc243af0f78e1335c4d75e63d7020412c9a44a9a))
* implement 1RM Tracker card on account page ([d10b279](https://github.com/jburns24/five31/commit/d10b2792ba2dd54dc2d967a8b99a1a0c916b11a3))
* implement core dark mode theme with color palette ([aa3c098](https://github.com/jburns24/five31/commit/aa3c09812a48dbd146a1bdfb2d5b06176ba27fa4))
* implement landing page with hero, program overview, and footer ([2b2711d](https://github.com/jburns24/five31/commit/2b2711dcaa6e5972aed2f291d28b1d1a323f69db))
* implement mobile hamburger menu navigation ([c7460ac](https://github.com/jburns24/five31/commit/c7460ac8389fef992b8b9a89a9696d67ef547a39))
* implement responsive desktop navigation ([84a2a61](https://github.com/jburns24/five31/commit/84a2a61746ae33a972c85e163efbee08d846c3ff))
* initial commit ([c33e852](https://github.com/jburns24/five31/commit/c33e85209ed612a97f58785d3e4988f110d9ea6a))
* integrate barbell SVG background pattern ([28653f6](https://github.com/jburns24/five31/commit/28653f6dd191870d368bd63408db84827e4ca5b9))
* integrate user creation with NextAuth sign-in callback ([f93aa91](https://github.com/jburns24/five31/commit/f93aa91691fbc24c9f79ee1fe4e5b3934a77e626))
* migrate theoretical 1RM section to Stats page ([5b6b947](https://github.com/jburns24/five31/commit/5b6b94785e5d86c26fb3b85bd857fe2377478f76))
* set up MongoDB Atlas dependencies and connection infrastructure ([7c3c964](https://github.com/jburns24/five31/commit/7c3c964d7ff7c303a15270554be24d83df8cbe93))
* setup testing infrastructure and workout calculator ([9e01d52](https://github.com/jburns24/five31/commit/9e01d521b21e9dd47545f82dfea615a823d4861b))
* update authentication flow and remove dashboard ([d4f7998](https://github.com/jburns24/five31/commit/d4f79980d3fff40601f8eeecced641fccb03a324))
* update data models for workout tracking ([1800a21](https://github.com/jburns24/five31/commit/1800a21789f6ea5cbfee35b97649cd5eff457a9d))


### Bug Fixes

* improve workout navigation, AMRAP layout, and progression logic ([f51eff6](https://github.com/jburns24/five31/commit/f51eff65ae8c76872afb2673f56ee5b9f5eecb9c))
* sign-in functionality and navigation issues ([5c453c9](https://github.com/jburns24/five31/commit/5c453c98e14302e2d0fce84a82f8fe5efd06ba4e))

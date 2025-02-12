/**
 * This file is part of the Music Education Interface project.
 * Copyright (C) 2025 Alberto Acquilino
 *
 * Licensed under the GNU Affero General Public License v3.0.
 * See the LICENSE file for more details.
 */

import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.meiteam.trumpet',
  appName: 'MEI-Trumpet',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;

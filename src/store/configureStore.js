/* eslint-env node */

import DevStore from './configureStore.dev'
import ProdStore from './configureStore.prod'

export default process.env.NODE_ENV === 'production' ? ProdStore : DevStore

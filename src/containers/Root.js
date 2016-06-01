/* eslint-env node */

import DevRoot from './Root.dev'
import ProdRoot from './Root.prod'

export default process.env.NODE_ENV === 'production' ? ProdRoot : DevRoot

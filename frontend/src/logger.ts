import log from 'loglevel'

const logger = log.getLogger('App')
logger.setLevel(
  process.env.NODE_ENV === 'production' ? log.levels.ERROR : log.levels.INFO
)

export default logger

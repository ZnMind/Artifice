import Analytics from 'analytics';
import googleAnalytics from '@analytics/google-analytics';

const analytics = Analytics({
  app: 'Artifice',
  plugins: [
    googleAnalytics({
      measurementIds: ['G-S0T9CZGFE1']
    })
  ]
})

export default analytics;
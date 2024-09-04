module.exports = [
  {
    script: './dist/src/index.js',
    name: 'dating-app-api',
    exec_mode: 'cluster',
    instances: 2,
    autorestart: true,
    watch: false,
    time: true,
  },
]

module.exports = {
  '/xapi/custom-navigation-endpoint': [
    { path: '/introduction', label: 'Introduction' },
    { path: '/benefits', label: 'Benefits' },
    { path: '/guide', label: 'Guide' },
    { path: '/coverage', label: 'Coverage' },
  ],
  '/xapi/custom-benefits-endpoint': [
    {
      title: 'General',
      list: [
        'No need for grunt/gulp scripts, webpack handles via npm script aliases',
        "Built-in karma/jasmine, 'npm run test'",
        'Built-in Istanbul coverage reports',
        'Built-in bundlling using webpack 2.x',
        'ES6 support using babel out of the box',
      ],
    },
    {
      title: 'Templating with Handlebars',
      list: [
        'No longer need to manaually register partials and/or helpers',
        'Isomorphic, templates, partials, helpers shared server and client side',
      ],
    },
    {
      title: 'Backbone/Marionette dependencies scaffolded with every new project',
      list: [
        'Promote development in isolation',
        'Each feature individually version for better maitenance and support',
        'Loosely coupled application architecture',
        'No script aliases(require.config)',
        'No longer need to manage optimization config files(rjsbo/)',
        'Page level architecture',
      ],
    },
    {
      title: 'Modular CSS',
      list: [
        'scss files can now be required at the javascript module level',
        'full support for modular css using scss',
        'full support for postcss functionality and features',
      ],
    },
  ],
  '/xapi/custom-guide-endpoint': [
    {
      title: 'Install required software',
      code: [
        {
          comments: '<a href="https://nodejs.org/en/">Download and install 5.x version of nodejs</a>',
        },
      ],
    },
    {
      title: 'Configure npm to use our interal npm registry',
      code: [
        {
          cmd: '_auth=ZGVwbG95ZXI6QVA0bnNQRVIzQ0JCcXJqRlVBeURiZnJibmRL<br>always-auth=true<br>email=macys.com_SF_DevOps@macys.com<br>@core:registry=http://ci-artifacts.devops.fds.com/artifactory/api/npm/macys-npm-private/<br>@page:registry=http://ci-artifacts.devops.fds.com/artifactory/api/npm/macys-npm-private/<br>@feature:registry=http://ci-artifacts.devops.fds.com/artifactory/api/npm/macys-npm-private/<br>@example:registry=http://ci-artifacts.devops.fds.com/artifactory/api/npm/macys-npm-private/<br>registry=http://registry.npmjs.org/<br>prefix=~/.npm-global',
          comments: 'Open or create the file \'~/.npmrc\' in your home directory and paste the following',
        },
      ],
    },
    {
      title: 'Verify it\'s working',
      code: [
        {
          image: '/feature/pros-ui/latest/images/verify-working.jpg',
          comments: 'In a new terminal window type \'npm view @feature/header\'. You should see similar output.',
        },
      ],
    },
    {
      title: 'Install global libraries',
      code: [
        {
          cmd: 'npm install -g yo',
          comments: 'yeoman scaffolding framework',
        },
        {
          cmd: 'npm install -g @core/generator-macys',
          comments: 'macys specific yeoman generator',
        },
      ],
    },
  ],
};

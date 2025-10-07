#!/usr/bin/env node

import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'

const execAsync = promisify(exec)

class DeploymentChecker {
  constructor() {
    this.errors = []
    this.warnings = []
    this.success = []
  }

  log(type, message) {
    const timestamp = new Date().toISOString()
    const prefix = {
      error: '❌',
      warning: '⚠️',
      success: '✅',
      info: 'ℹ️'
    }[type]
    
    console.log(`${prefix} [${timestamp}] ${message}`)
    
    if (type === 'error') this.errors.push(message)
    if (type === 'warning') this.warnings.push(message)
    if (type === 'success') this.success.push(message)
  }

  async checkFile(filePath, description) {
    try {
      await fs.access(filePath)
      this.log('success', `${description}: ${filePath}`)
      return true
    } catch (error) {
      this.log('error', `Missing ${description}: ${filePath}`)
      return false
    }
  }

  async checkPackageJson(packagePath, requiredScripts = []) {
    try {
      const content = await fs.readFile(packagePath, 'utf8')
      const pkg = JSON.parse(content)
      
      this.log('success', `Package.json found: ${packagePath}`)
      
      // Check required scripts
      for (const script of requiredScripts) {
        if (pkg.scripts && pkg.scripts[script]) {
          this.log('success', `Script '${script}' found in ${packagePath}`)
        } else {
          this.log('warning', `Script '${script}' missing in ${packagePath}`)
        }
      }
      
      return true
    } catch (error) {
      this.log('error', `Invalid package.json: ${packagePath}`)
      return false
    }
  }

  async checkEnvironmentFiles() {
    this.log('info', 'Checking environment configuration...')
    
    const envFiles = [
      { path: 'client/.env.example', description: 'Client environment example' },
      { path: 'server/.env.example', description: 'Server environment example' }
    ]
    
    for (const { path: filePath, description } of envFiles) {
      await this.checkFile(filePath, description)
    }
  }

  async checkDeploymentConfigs() {
    this.log('info', 'Checking deployment configurations...')
    
    const configs = [
      { path: '.github/workflows/deploy-github-pages.yml', description: 'GitHub Pages workflow' },
      { path: 'netlify.toml', description: 'Netlify configuration' },
      { path: 'render.yaml', description: 'Render configuration' },
      { path: 'Dockerfile', description: 'Docker configuration' },
      { path: 'docker-compose.yml', description: 'Docker Compose configuration' }
    ]
    
    for (const { path: filePath, description } of configs) {
      await this.checkFile(filePath, description)
    }
  }

  async checkPackageFiles() {
    this.log('info', 'Checking package configurations...')
    
    // Check client package.json
    await this.checkPackageJson('client/package.json', [
      'dev', 'build', 'preview', 'build:github', 'build:netlify', 'build:render'
    ])
    
    // Check server package.json
    await this.checkPackageJson('server/package.json', [
      'start', 'dev', 'build', 'seed', 'health'
    ])
    
    // Check root package.json
    await this.checkPackageJson('package.json', [
      'seed', 'seed:dev', 'seed:prod'
    ])
  }

  async checkDependencies() {
    this.log('info', 'Checking dependencies...')
    
    try {
      // Check client dependencies
      const { stdout: clientDeps } = await execAsync('cd client && pnpm list --depth=0')
      this.log('success', 'Client dependencies check passed')
    } catch (error) {
      this.log('error', 'Client dependencies check failed')
    }
    
    try {
      // Check server dependencies
      const { stdout: serverDeps } = await execAsync('cd server && npm list --depth=0')
      this.log('success', 'Server dependencies check passed')
    } catch (error) {
      this.log('error', 'Server dependencies check failed')
    }
  }

  async checkBuildProcess() {
    this.log('info', 'Testing build process...')
    
    try {
      // Test client build
      this.log('info', 'Testing client build...')
      const { stdout: buildOutput } = await execAsync('cd client && pnpm run build', { timeout: 120000 })
      this.log('success', 'Client build successful')
      
      // Check if dist folder exists
      await this.checkFile('client/dist/index.html', 'Built client index.html')
      
    } catch (error) {
      this.log('error', `Client build failed: ${error.message}`)
    }
  }

  async checkServerHealth() {
    this.log('info', 'Checking server configuration...')
    
    // Check if health route exists
    await this.checkFile('server/routes/health.js', 'Health check route')
    
    // Check if server.js imports health routes
    try {
      const serverContent = await fs.readFile('server/server.js', 'utf8')
      if (serverContent.includes('healthRoutes')) {
        this.log('success', 'Health routes imported in server.js')
      } else {
        this.log('warning', 'Health routes not imported in server.js')
      }
    } catch (error) {
      this.log('error', 'Could not read server.js')
    }
  }

  async checkDatabaseConfig() {
    this.log('info', 'Checking database configuration...')
    
    // Check seed files
    await this.checkFile('database/seed.js', 'Database seed script')
    await this.checkFile('database/seedData.js', 'Seed data file')
    await this.checkFile('database/extendedSeedData.js', 'Extended seed data')
    
    // Check models
    const modelFiles = [
      'server/models/User.js',
      'server/models/Portfolio.js',
      'server/models/Template.js',
      'server/models/Job.js',
      'server/models/Revenue.js',
      'server/models/EmailCampaign.js',
      'server/models/EmailSubscriber.js',
      'server/models/FreelanceProject.js',
      'server/models/ClientReview.js'
    ]
    
    for (const modelFile of modelFiles) {
      await this.checkFile(modelFile, `Model: ${path.basename(modelFile)}`)
    }
  }

  async checkAdvancedFeatures() {
    this.log('info', 'Checking advanced features...')
    
    // Check advanced components
    const advancedComponents = [
      'client/src/components/dashboard/marketing/EmailMarketing.jsx',
      'client/src/components/dashboard/profile/SocialMediaIntegration.jsx',
      'client/src/components/portfolio/TierBasedPortfolioEditor.jsx'
    ]
    
    for (const component of advancedComponents) {
      await this.checkFile(component, `Advanced component: ${path.basename(component)}`)
    }
  }

  async generateReport() {
    this.log('info', 'Generating deployment readiness report...')
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        total_checks: this.success.length + this.warnings.length + this.errors.length,
        successful: this.success.length,
        warnings: this.warnings.length,
        errors: this.errors.length,
        ready_for_deployment: this.errors.length === 0
      },
      details: {
        successes: this.success,
        warnings: this.warnings,
        errors: this.errors
      }
    }
    
    // Write report to file
    await fs.writeFile('deployment-report.json', JSON.stringify(report, null, 2))
    this.log('success', 'Deployment report saved to deployment-report.json')
    
    // Print summary
    console.log('\n' + '='.repeat(60))
    console.log('🚀 DEPLOYMENT READINESS REPORT')
    console.log('='.repeat(60))
    console.log(`✅ Successful checks: ${report.summary.successful}`)
    console.log(`⚠️  Warnings: ${report.summary.warnings}`)
    console.log(`❌ Errors: ${report.summary.errors}`)
    console.log(`📊 Total checks: ${report.summary.total_checks}`)
    console.log('='.repeat(60))
    
    if (report.summary.ready_for_deployment) {
      console.log('🎉 READY FOR DEPLOYMENT!')
      console.log('Your application is ready to be deployed to production.')
    } else {
      console.log('⚠️  NOT READY FOR DEPLOYMENT')
      console.log('Please fix the errors above before deploying.')
    }
    
    console.log('\nNext steps:')
    console.log('1. Fix any errors listed above')
    console.log('2. Configure environment variables')
    console.log('3. Choose your deployment platform:')
    console.log('   - GitHub Pages: git push origin main')
    console.log('   - Netlify: Connect repository or use CLI')
    console.log('   - Render: Connect repository with render.yaml')
    console.log('   - Docker: docker-compose up --build')
    console.log('\nSee DEPLOYMENT.md for detailed instructions.')
    
    return report
  }

  async run() {
    console.log('🔍 Starting deployment readiness check...\n')
    
    await this.checkEnvironmentFiles()
    await this.checkDeploymentConfigs()
    await this.checkPackageFiles()
    await this.checkDependencies()
    await this.checkServerHealth()
    await this.checkDatabaseConfig()
    await this.checkAdvancedFeatures()
    await this.checkBuildProcess()
    
    return await this.generateReport()
  }
}

// Run the checker
if (import.meta.url === `file://${process.argv[1]}`) {
  const checker = new DeploymentChecker()
  checker.run().catch(console.error)
}

export default DeploymentChecker

module.exports = {
  // Lynx runtime configuration
  runtime: {
    // Enable React bridge
    react: true,
    
    // Configure animation engine
    animation: {
      enabled: true,
      defaultDuration: 300,
      defaultEasing: 'easeOutCubic'
    },
    
    // Configure native components
    components: {
      grid: {
        enabled: true,
        defaultConfig: {
          columns: 3,
          gap: 8
        }
      }
    }
  },
  
  // Development settings
  development: {
    // Enable hot reload for Lynx components
    hotReload: true,
    
    // Enable debug logging
    debug: true
  },
  
  // Build settings
  build: {
    // Output directory for Lynx components
    outDir: './src/lynx-components/dist',
    
    // Enable source maps
    sourceMap: true
  }
}; 
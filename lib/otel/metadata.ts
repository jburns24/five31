import { execSync } from 'child_process';

/**
 * Get the service version from environment or git
 * @returns Git SHA or 'unknown'
 */
export function getServiceVersion(): string {
  // Try environment variable first
  if (process.env.GIT_SHA) {
    return process.env.GIT_SHA;
  }

  // Fallback to git command
  try {
    const gitSha = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    return gitSha;
  } catch (error) {
    return 'unknown';
  }
}

/**
 * Get the service environment
 * @returns Environment name (development, staging, production)
 */
export function getServiceEnvironment(): string {
  return process.env.NODE_ENV || 'development';
}

/**
 * Get deployment age in minutes
 * @returns Minutes since process started
 */
export function getDeploymentAgeMinutes(): number {
  return Math.floor(process.uptime() / 60);
}

/**
 * Get runtime metadata
 * @returns Object with Node.js runtime information
 */
export function getRuntimeMetadata(): Record<string, string | number> {
  return {
    'node.version': process.version,
    'process.pid': process.pid,
    'process.platform': process.platform,
  };
}

/**
 * Get all service metadata
 * @returns Combined metadata object
 */
export function getAllServiceMetadata(): Record<string, string | number> {
  return {
    'service.version': getServiceVersion(),
    'service.environment': getServiceEnvironment(),
    'deployment.age_minutes': getDeploymentAgeMinutes(),
    ...getRuntimeMetadata(),
  };
}

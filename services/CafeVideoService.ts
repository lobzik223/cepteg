import { Cafe } from './CafeService';

export interface VideoConfig {
  videoUrl?: string; // URL to video file (for server cafes)
  localVideoPath?: string; // Local video path (for demo cafes)
  fallbackColors?: string[]; // Fallback gradient colors if video fails
  videoPosition?: 'center' | 'left' | 'right'; // Video positioning
}

export class CafeVideoService {
  private static instance: CafeVideoService;

  public static getInstance(): CafeVideoService {
    if (!CafeVideoService.instance) {
      CafeVideoService.instance = new CafeVideoService();
    }
    return CafeVideoService.instance;
  }

  /**
   * Get video configuration for a cafe
   */
  public getVideoConfig(cafe: Cafe): VideoConfig {
    return cafe.videoConfig || this.getDefaultVideoConfig();
  }

  /**
   * Get default video configuration - videos removed
   */
  public getDefaultVideoConfig(): null {
    // Videos have been removed from the project
    return null;
  }

  /**
   * Update video configuration for a cafe (for admin panel)
   */
  public async updateVideoConfig(cafeId: string, videoConfig: VideoConfig): Promise<boolean> {
    try {
      // In the future, this will make an API call to update the cafe's video config
      // const response = await fetch(`${apiEndpoint}/cafes/${cafeId}/video-config`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(videoConfig),
      // });
      // return response.ok;

      // For now, just log the update
      console.log(`Updating video config for cafe ${cafeId}:`, videoConfig);
      return true;
    } catch (error) {
      console.error('Error updating video config:', error);
      return false;
    }
  }

  /**
   * Get available video presets for admin panel - videos removed
   */
  public getVideoPresets(): any[] {
    // Videos have been removed from the project
    return [];
  }

  /**
   * Validate video configuration - videos removed
   */
  public validateVideoConfig(config: any): { isValid: boolean; errors: string[] } {
    // Videos have been removed from the project
    return { isValid: true, errors: [] };
  }

  /**
   * Get video position style for proper positioning
   */
  public getVideoPositionStyle(
    position: 'center' | 'left' | 'right',
    isTablet: boolean,
    isLandscape: boolean,
    width: number,
    height: number
  ) {
    let marginLeft = 0;
    let currentWidth = width;

    // Adjust width to allow for offset - увеличиваем ширину для покрытия
    if (isTablet) {
      currentWidth = isLandscape ? width + 1200 : width + 1100;
    } else {
      currentWidth = width + 600;
    }

    switch (position) {
      case 'left':
        marginLeft = isTablet ? (isLandscape ? -250 : -150) : -250;
        break;
      case 'right':
        marginLeft = isTablet ? (isLandscape ? 50 : 150) : -50;
        break;
      case 'center':
      default:
        marginLeft = isTablet ? (isLandscape ? -100 : 0) : -150;
        break;
    }

    return {
      width: currentWidth,
      marginLeft: marginLeft,
    };
  }

  /**
   * Get video source for a cafe - videos removed
   */
  public getVideoSource(cafe: Cafe): null {
    // Videos have been removed from the project
    return null;
  }
}

// Export singleton instance
export const cafeVideoService = CafeVideoService.getInstance();

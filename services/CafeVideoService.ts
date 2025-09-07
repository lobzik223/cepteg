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
   * Get default video configuration
   */
  public getDefaultVideoConfig(): VideoConfig {
    return {
      localVideoPath: 'coffee_video.mp4',
      fallbackColors: ['#E8F4FD', '#D1E7DD', '#C3E9C0'],
      videoPosition: 'center',
    };
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
   * Get available video presets for admin panel
   */
  public getVideoPresets(): Array<{ id: string; name: string; config: VideoConfig }> {
    return [
      {
        id: 'coffee-classic',
        name: 'Classic Coffee',
        config: {
          localVideoPath: 'coffee_video.mp4',
          fallbackColors: ['#E8F4FD', '#D1E7DD', '#C3E9C0'],
          videoPosition: 'center',
        },
      },
      {
        id: 'coffee-warm',
        name: 'Warm Coffee',
        config: {
          localVideoPath: 'coffee_video.mp4',
          fallbackColors: ['#FEF3C7', '#FDE68A', '#F59E0B'],
          videoPosition: 'left',
        },
      },
      {
        id: 'coffee-green',
        name: 'Green Brew',
        config: {
          localVideoPath: 'coffee_video.mp4',
          fallbackColors: ['#ECFDF5', '#D1FAE5', '#10B981'],
          videoPosition: 'right',
        },
      },
      {
        id: 'coffee-purple',
        name: 'Purple Blend',
        config: {
          localVideoPath: 'coffee_video.mp4',
          fallbackColors: ['#F3E8FF', '#DDD6FE', '#8B5CF6'],
          videoPosition: 'center',
        },
      },
    ];
  }

  /**
   * Validate video configuration
   */
  public validateVideoConfig(config: VideoConfig): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!config.videoUrl && !config.localVideoPath) {
      errors.push('Either videoUrl or localVideoPath must be provided');
    }

    if (config.fallbackColors && config.fallbackColors.length < 2) {
      errors.push('Fallback colors must have at least 2 colors');
    }

    if (config.videoPosition && !['center', 'left', 'right'].includes(config.videoPosition)) {
      errors.push('Video position must be center, left, or right');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
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
   * Get video source for a cafe
   */
  public getVideoSource(cafe: Cafe): any {
    const config = this.getVideoConfig(cafe);

    if (config.videoUrl) {
      // Server video URL
      return { uri: config.videoUrl };
    }

    if (config.localVideoPath) {
      // Local video path for demo cafes - use static mapping
      const videoMap: Record<string, any> = {
        'coffee_video.mp4': require('../assets/coffee_video.mp4'),
        'coffee_house_video.mp4': require('../assets/coffee_house_video.mp4'),
        'brew_bean_video.mp4': require('../assets/brew_bean_video.mp4'),
      };

      const videoSource = videoMap[config.localVideoPath];
      if (videoSource) {
        return videoSource;
      } else {
        console.warn(`Video not found: ${config.localVideoPath}, using default`);
        return require('../assets/coffee_video.mp4');
      }
    }

    // Fallback to default video
    return require('../assets/coffee_video.mp4');
  }
}

// Export singleton instance
export const cafeVideoService = CafeVideoService.getInstance();

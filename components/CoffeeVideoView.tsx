import { ResizeMode, Video } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function CoffeeVideoView() {
  const video = useRef<Video>(null);

  useEffect(() => {
    // Small delay before starting video
    const timer = setTimeout(() => {
      if (video.current) {
        video.current.playAsync();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Beautiful background as fallback */}
      <LinearGradient
        colors={['#B3CCF5', '#E6F2FF', '#D1E7DD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />
      
      {/* Video over background */}
      <Video
        ref={video}
        style={styles.video}
        source={require('../assets/coffee_video.mp4')}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false} // Don't start automatically at first
        isLooping={true}
        isMuted={true}
        useNativeControls={false}
        onLoad={() => {
          console.log('Video loaded successfully!');
          // Start video after loading
          video.current?.playAsync();
        }}
        onError={(error) => {
          console.log('Video loading error:', error);
        }}
        onPlaybackStatusUpdate={(status) => {
          if (status.isLoaded && status.didJustFinish) {
            // Restart video when finished
            video.current?.replayAsync();
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: 600,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: -16,
    marginTop: -100,
    position: 'relative',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

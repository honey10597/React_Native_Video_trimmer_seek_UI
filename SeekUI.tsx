import { moderateScale, width } from '@constants/responsiveSize';

import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedGestureHandler, useAnimatedReaction, useAnimatedStyle, useDerivedValue, useSharedValue, withTiming } from 'react-native-reanimated';

const MOVE_WIDTH = -10
const MOVE_SPEED = 5

const ZZZ = () => {

    // const [isPlaying, setIsPlaying] = useState(false)

    const [videos, setVideos] = useState([{ width: 100 },
    { width: 250 },
    { width: 60 },
    { width: 300 },
    { width: 250 },
    { width: 150 },
    ])

    const [mediaViewWidth, setMediaViewWidth] = useState(0)
    const [play, setPlay] = useState(false)

    const translateX = useSharedValue(0)
    const isPlaying = useSharedValue(0);

    useEffect(() => {
        var width = 0
        videos.map((ite) => {
            width += ite?.width
        })
        setMediaViewWidth(width)
        console.log(width, "videosvideosvideosvideos ZZZ")
    }, [])

    const played = useDerivedValue(() => {
        console.log(isPlaying.value, "ZZZ useDerivedValue");
        if (isPlaying.value === 0) {
            'worklet';
            runOnJS(setPlay)(false);
            // setPlay(false)
        } else {
            'worklet';
            runOnJS(setPlay)(true);
        }
        return isPlaying.value
    });

    console.log(isPlaying.value, "ZZZ played outside", -translateX.value - 10)

    useEffect(() => {
        if (isPlaying.value === 1) {
            translateX.value = withTiming(MOVE_WIDTH, {
                duration: MOVE_SPEED,
            })
        }
    }, [isPlaying])

    useAnimatedReaction(() => {
        return { val1: isPlaying.value, val2: translateX.value }
    }, (result, previous) => {
        if (result !== previous) {
            console.log(played.value, "ZZZ useAnimatedReaction", Math.abs(translateX.value).toFixed(2), mediaViewWidth.toFixed(2))
            if (isPlaying.value === 1 &&
                (Math.abs(translateX.value) < Number(mediaViewWidth))) {
                if (translateX.value === -mediaViewWidth) return

                translateX.value = withTiming(translateX.value - 5, {
                    duration: MOVE_SPEED
                })
            }
        }
    }, [isPlaying.value, translateX]);

    const videoAnimatedStyle = useAnimatedStyle(() => ({
        transform: [
            {
                translateX: translateX.value
            }
        ]
    }))

    const onGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent>({
        onStart: (_, context: any) => {
            context.startX = translateX.value
        },
        onActive: (event, context: any) => {
            console.log(context.startX + event.translationX, "onGestureEvent");
            if (context.startX + event.translationX < 0) {
                translateX.value = context.startX + event.translationX
            }
        },
        onEnd: (event) => {
            // if (Math.abs(event?.translationX) >= 80) {
            // if (event?.translationX <= -80) {
            //     translateX.value = withTiming(-80, { duration: 150 })
            // } else {
            //     translateX.value = withTiming(0, { duration: 150 })
            // }
        }
    })

    const _playPause = () => {
        console.log(isPlaying.value, "ZZZ _playPause");
        if (isPlaying.value === 0) {
            isPlaying.value = 1
        } else {
            isPlaying.value = 0
        }
    }

    return (
        <GestureHandlerRootView>
            <View style={styles.container}>
                <View style={styles.playView}>
                    <PanGestureHandler
                        failOffsetY={[-5, 5]}
                        activeOffsetX={[-5, 5]}
                        onGestureEvent={onGestureEvent}
                    >
                        <Animated.View
                            onLayout={(event) => {
                                const { width } = event.nativeEvent.layout;
                                console.log(event.nativeEvent, "ZZZ width", width)
                                setMediaViewWidth((width + width) * 3)
                            }}
                            style={[styles.videoGroup, videoAnimatedStyle]}>
                            {
                                videos.map((ite, ind) => {
                                    return (
                                        <Animated.Image
                                            source={{ uri: "https://iso.500px.com/wp-content/uploads/2022/07/Sunset-somewhere-in-Iowa-By-Vath.-Sok-2.jpeg" }}
                                            style={{
                                                ...styles.videoView,
                                                width: ite?.width,
                                                marginStart: ind !== 0 ? 4 : width / 2.3
                                            }}
                                        />
                                    )
                                })
                            }
                        </Animated.View>
                    </PanGestureHandler>
                    <View style={styles.currentPositionStick} />
                </View>
                <TouchableOpacity
                    onPress={_playPause}
                    activeOpacity={0.9}
                    style={{
                        justifyContent: 'center',
                        alignSelf: "center",
                        marginTop: moderateScale(100)
                    }}
                >
                    <Image
                        source={{
                            uri:
                                play ?
                                    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU3DLHqo1XsNPvn47YKtbJytnS0pdXOJ8F22BspTssOA&s"
                                    :
                                    "https://static.thenounproject.com/png/573710-200.png"
                        }}
                        style={{
                            height: 100,
                            width: 100,
                            tintColor: play ? null : "white"
                        }}
                    />
                </TouchableOpacity>
            </View>


        </GestureHandlerRootView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "black"
    },
    playView: {
        justifyContent: "center",
    },
    videoView: {
        height: 80,
        width: width * 2,
        borderRadius: 8,
        marginStart: width / 2.3,
        backgroundColor: "lightblue",
        zIndex: 1
    },
    currentPositionStick: {
        height: 120,
        width: 10,
        borderRadius: 8,
        backgroundColor: "yellow",
        position: "absolute",
        marginStart: width / 2.3,
        zIndex: 2
    },
    videoGroup: {
        flexDirection: "row"
    }
})

export default ZZZ;

import { Animated, Easing, StyleSheet, Text } from 'react-native';
import { Component } from 'react';

export default class Notification extends Component {
    state = { height: -1000 };

    static defaultProps = {
        delay: 5000,
        onClose: () => {},
        onOpen: () => {},
    };

    componentDidMount() { this.startSlideIn(); }

    getAnimation(value, autoHide) {
        const { delay } = this.props;
        return Animated.timing(
            this.animatedValue,
            {
                delay: autoHide ? delay : 0,
                duration: 500,
                easing: Easing.cubic,
                toValue: value,
                useNativeDriver: false,
            }
        );
    }

    onLayoutChange = (event) => {
        const { layout: { height } } = event.nativeEvent;
        this.setState({ height });
    }

    render() {
        const { height } = this.state;
        const { message } = this.props;
        const top = this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [-height, -1],
        });
        return (
            <Animated.View
                onLayout={this.onLayoutChange}
                style={[
                    styles.main,
                    { top }
                ]}
            >
                <Text style={styles.text}>{message}</Text>
            </Animated.View>
        );
    }

    startSlideIn() {
        const { autoHide, onOpen } = this.props;

        this.animatedValue.setValue(0);
        this.getAnimation(1).start(() => {
            onOpen();
            if(autoHide) { this.startSlideOut(); }
        });
    }

    startSlideOut() {
        const { autoHide, onClose } = this.props;

        this.animatedValue.setValue(1);
        this.getAnimation(-1, autoHide).start(() => onClose());
    }

    UNSAFE_componentWillMount() { this.animatedValue = new Animated.Value(0); }
}

const styles = StyleSheet.create({
    main: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        left: 0,
        padding: 10,
        position: 'absolute',
        right: 0,
    },
    text: {
        color: '#ffffff',
    },
});
const SimpleNeuro= {
    train(xArrays, yArray, layerIndex = 0, maxLayers = 5) {
        var firstNeuronsCount=xArrays[0].length;
        for (var i = 0; i < firstNeuronsCount; i++) {
            var neuronModifier = neuron[i];
            var sum = 0;
            for (var j = 0; j < xArrays; j++) {
                if (j !== i)
                    sum = sum + xArrays[j];
            }
        }

    }

    _train(prevNeurons, layerlevel) {
        for (var i = 0; i < firstNeuronsCount; i++) {
            var neuronModifier = neuron[i];
            var sum = 0;
            for (var j = 0; j < xArrays; j++) {
                if (j !== i)
                    sum = sum + xArrays[j];
            }
        }

    }
}
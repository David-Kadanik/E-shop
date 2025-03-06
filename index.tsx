import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { reload } from 'expo-router/build/global-state/routing';

type UnitType = 'length' | 'weight' | 'temperature' | 'volume' | 'area' | 'currency' | 'time';

export default function App() {
  const [unitType, setUnitType] = useState<UnitType>('length');
  const [inputUnit, setInputUnit] = useState<string>('meters');
  const [outputUnit, setOutputUnit] = useState<string>('kilometers');
  const [value, setValue] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const conversions = {
    length: {
      units: ['meters', 'kilometers', 'miles', 'feet', 'inches', 'Vojta Zouhar'],
      factors: {
        meters: 1,
        kilometers: 0.001,
        miles: 0.000621371,
        feet: 3.28084,
        inches: 39.3701,
        'Vojta Zouhar': 0.595238,
      },
    },
    weight: {
      units: ['kilograms', 'grams', 'pounds', 'ounces'],
      factors: {
        kilograms: 1,
        grams: 1000,
        pounds: 2.20462,
        ounces: 35.274,
      },
    },
    temperature: {
      units: ['celsius', 'fahrenheit', 'kelvin'],
      convert: (value: number, from: string, to: string): number => {
        if (from === to) return value;
        if (from === 'celsius') {
          if (to === 'fahrenheit') return value * 9 / 5 + 32;
          if (to === 'kelvin') return value + 273.15;
        } else if (from === 'fahrenheit') {
          if (to === 'celsius') return (value - 32) * 5 / 9;
          if (to === 'kelvin') return (value - 32) * 5 / 9 + 273.15;
        } else if (from === 'kelvin') {
          if (to === 'celsius') return value - 273.15;
          if (to === 'fahrenheit') return (value - 273.15) * 9 / 5 + 32;
        }
        return value;
      },
    },
    volume: {
      units: ['liters', 'milliliters', 'cubic meters', 'cubic feet'],
      factors: {
        liters: 1,
        milliliters: 1000,
        'cubic meters': 0.001,
        'cubic feet': 0.0353147,
      },
    },
    area: {
      units: ['square meters', 'square kilometers', 'square feet', 'acres'],
      factors: {
        'square meters': 1,
        'square kilometers': 0.000001,
        'square feet': 10.7639,
        acres: 0.000247105,
      },
    },
    currency: {
      units: ['czk', 'usd', 'eur', 'gbp', 'rub'],
      factors: {
        czk: 1,
        usd: 0.044,
        eur: 0.042,
        gbp: 0.036,
        rub: 4.45,
      },
    },
    time: {
      units: ['seconds', 'minutes', 'hours', 'days'],
      factors: {
        seconds: 1,
        minutes: 1 / 60,
        hours: 1 / 3600,
        days: 1 / 86400,
      },
    },
  };

  const handleConvert = () => {
    if (!value || isNaN(Number(value))) {
      setResult('Invalid input');
      return;
    }

    const inputValue = parseFloat(value);

    let convertedValue: string;
    if (unitType === 'temperature') {
      const convertFn = conversions.temperature.convert;
      convertedValue = convertFn(inputValue, inputUnit, outputUnit).toFixed(5);
    } else {
      const { factors } = conversions[unitType];
      convertedValue = (
        (inputValue / factors[inputUnit as keyof typeof factors]) *
        factors[outputUnit as keyof typeof factors]
      ).toFixed(5);
    }

    setResult(convertedValue);

    // Add the conversion result to the history
    setHistory((prevHistory) => [
      ...prevHistory,
      `${inputValue} ${inputUnit} = ${convertedValue} ${outputUnit}`,
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Unit Converter</Text>

      <Text style={styles.label}>Select Conversion Type</Text>
      <Picker
        selectedValue={unitType}
        style={styles.picker}
        onValueChange={(value: UnitType) => {
          setUnitType(value);
          setInputUnit(conversions[value].units[0]);
          setOutputUnit(conversions[value].units[1]);
        }}
      >
        <Picker.Item label="Length" value="length" />
        <Picker.Item label="Weight" value="weight" />
        <Picker.Item label="Temperature" value="temperature" />
        <Picker.Item label="Volume" value="volume" />
        <Picker.Item label="Area" value="area" />
        <Picker.Item label="Currency" value="currency" />
        <Picker.Item label="Time" value="time" />
      </Picker>

      <Text style={styles.label}>Input Unit</Text>
      <Picker
        selectedValue={inputUnit}
        style={styles.picker}
        onValueChange={(value: string) => setInputUnit(value)}
      >
        {conversions[unitType].units.map((unit) => (
          <Picker.Item key={unit} label={unit} value={unit} />
        ))}
      </Picker>

      <Text style={styles.label}>Output Unit</Text>
      <Picker
        selectedValue={outputUnit}
        style={styles.picker}
        onValueChange={(value: string) => setOutputUnit(value)}
      >
        {conversions[unitType].units.map((unit) => (
          <Picker.Item key={unit} label={unit} value={unit} />
        ))}
      </Picker>

      <Text style={styles.label}>Enter Value</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={value}
        onChangeText={(text) => setValue(text)}
        placeholder="Enter a number"
      />

      <Button title="Convert" onPress={handleConvert} />

      {result !== null && (
        <Text style={styles.result}>
          Result: {result} {outputUnit}
        </Text>
      )}

      <ScrollView style={styles.historyContainer}>
        <Text style={styles.historyTitle}>Conversion History:</Text>
        {history.map((entry, index) => (
          <Text key={index} style={styles.historyEntry}>
            {entry}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000',
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: '#333',
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginVertical: 10,
    color: '#fff',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#fff',
    backgroundColor: '#333',
  },
  input: {
    height: 40,
    borderColor: '#666',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
    color: '#fff',
    backgroundColor: '#222',
  },
  result: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: 'center',
    color: '#fff',
    
  },
  historyContainer: {
    flex: 1,
    marginTop: 20,
    maxHeight: "100%",  
    borderTopWidth: 1,
    borderTopColor: '#666',
    paddingTop: 12,
    flexShrink: 1, 
    
  },
  
  historyTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  historyEntry: {
    fontSize: 14,
    color: '#fff',
    marginVertical: 2,
  },
});

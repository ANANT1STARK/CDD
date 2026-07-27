import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Expects route.params = { result, imageUri }
// result shape (from MongoDB):
// { disease_id, name, crop_type, status: 'healthy' | 'diseased', pathogen,
//   description, severity, solution, prevention, note }

export default function ResultScreen({ route, navigation }) {
  const { result, imageUri } = route.params;
  const {
    name,
    crop_type,
    status,
    pathogen,
    description,
    severity,
    solution,
    prevention,
    note,
  } = result;

  const isHealthy = status === 'healthy';

  const severityColors = {
    Mild: { bg: '#1e2b1e', text: '#81c784' },
    Moderate: { bg: '#332b12', text: '#ffb74d' },
    Severe: { bg: '#331414', text: '#e57373' },
    None: { bg: '#1e2b1e', text: '#81c784' },
  };
  const severityStyle = severityColors[severity] || severityColors.Moderate;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'\u2190'}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Result</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.imageBox}>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.diseaseName}>{name}</Text>
              <Text style={styles.cropType}>{crop_type}</Text>
            </View>
            {severity ? (
              <View style={[styles.severityBadge, { backgroundColor: severityStyle.bg }]}>
                <Text style={[styles.severityText, { color: severityStyle.text }]}>
                  {severity}
                </Text>
              </View>
            ) : null}
          </View>

          {pathogen ? (
            <Text style={styles.pathogenText}>{pathogen}</Text>
          ) : null}

          <View style={styles.divider} />

          <View style={styles.sectionRow}>
            <Text style={styles.sectionIcon}>{'\u2139'}</Text>
            <Text style={styles.sectionTitle}>What's happening</Text>
          </View>
          <Text style={styles.sectionText}>{description}</Text>

          {!isHealthy && solution ? (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionIcon}>{'\u2695'}</Text>
                <Text style={styles.sectionTitle}>Solution</Text>
              </View>
              <Text style={styles.sectionText}>{solution}</Text>
            </>
          ) : null}

          {prevention ? (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionIcon}>{'\u2699'}</Text>
                <Text style={styles.sectionTitle}>Prevention</Text>
              </View>
              <Text style={styles.sectionText}>{prevention}</Text>
            </>
          ) : null}

          {note ? (
            <View style={styles.noteBox}>
              <Text style={styles.noteText}>{note}</Text>
            </View>
          ) : null}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => navigation.navigate('Capture')}
            >
              <Text style={styles.secondaryButtonText}>Scan again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: '#2a2a2a',
  },
  backArrow: {
    fontSize: 20,
    color: '#f2f2f2',
    width: 30,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#f2f2f2',
  },
  headerSpacer: {
    width: 30,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageBox: {
    height: 220,
    backgroundColor: '#1e1e1e',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  diseaseName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f2f2f2',
  },
  cropType: {
    fontSize: 13,
    color: '#9a9a9a',
    marginTop: 2,
  },
  pathogenText: {
    fontSize: 12,
    color: '#7a7a7a',
    fontStyle: 'italic',
    marginTop: 8,
  },
  severityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 10,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#2a2a2a',
    marginVertical: 16,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 6,
  },
  sectionIcon: {
    fontSize: 15,
    color: '#4caf50',
    marginRight: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f2f2f2',
  },
  sectionText: {
    fontSize: 14,
    color: '#c9c9c9',
    lineHeight: 21,
  },
  noteBox: {
    marginTop: 18,
    padding: 12,
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#666',
  },
  noteText: {
    fontSize: 12,
    color: '#a0a0a0',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#4caf50',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.08)',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4caf50',
  },
});
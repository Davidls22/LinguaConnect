import React, { useState } from 'react';
import { FlatList, Dimensions } from 'react-native';
import { Layout, Text, Card, Modal, Button, Icon, TopNavigation, TopNavigationAction } from '@ui-kitten/components';
import { fetchAllLanguages } from '@/services/languageService';

const { width } = Dimensions.get('window');

export default function DashboardScreen({ progress, selectedLanguage, onSelectLanguage }) {
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isProgressModalVisible, setProgressModalVisible] = useState(false);
  const [languages, setLanguages] = useState([]);

  const toggleLanguageModal = () => setLanguageModalVisible(!isLanguageModalVisible);
  const toggleProgressModal = () => setProgressModalVisible(!isProgressModalVisible);

  const fetchLanguages = async () => {
    try {
      const data = await fetchAllLanguages();
      setLanguages(data);
    } catch (error) {
      console.error('Error fetching languages:', error);
    }
  };

  const handleLanguageIconPress = () => {
    fetchLanguages();
    toggleLanguageModal();
  };

  return (
    <Layout style={{ flex: 1 }}>
      {/* Top Navigation Bar */}
      <TopNavigation
        alignment="center"
        accessoryRight={() => (
          <Layout style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Language Selector Icon */}
            <TopNavigationAction
              icon={(props) => <Icon {...props} name="globe-outline" />}
              onPress={handleLanguageIconPress}
            />
            {/* Progress Card Icon */}
            <TopNavigationAction
              icon={(props) => <Icon {...props} name="bar-chart-outline" />}
              onPress={toggleProgressModal}
            />
          </Layout>
        )}
      />

      {/* Language Selector Modal */}
      <Modal
        visible={isLanguageModalVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={toggleLanguageModal}
      >
        <Layout
          style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: '#fff',
            width: width - 40,
          }}
        >
          <Text category="h6" style={{ textAlign: 'center', marginBottom: 16 }}>
            🌍 Select Your Language
          </Text>
          <FlatList
            data={languages}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <Card
                style={{
                  marginBottom: 16,
                  borderWidth: selectedLanguage === item._id ? 2 : 1,
                  borderColor: selectedLanguage === item._id ? '#2563eb' : '#d1d5db',
                  borderRadius: 8,
                  padding: 16,
                }}
                onPress={() => {
                  onSelectLanguage(item._id);
                  toggleLanguageModal();
                }}
              >
                <Text category="s1" style={{ fontWeight: 'bold', textAlign: 'center' }}>
                  {item.name}
                </Text>
              </Card>
            )}
          />
          <Button appearance="ghost" onPress={toggleLanguageModal}>
            Close
          </Button>
        </Layout>
      </Modal>

      {/* Progress Modal */}
      <Modal
        visible={isProgressModalVisible}
        backdropStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        onBackdropPress={toggleProgressModal}
      >
        <Layout
          style={{
            padding: 16,
            borderRadius: 8,
            backgroundColor: '#fff',
            width: width - 40,
          }}
        >
          <Text category="h6" style={{ textAlign: 'center', marginBottom: 16 }}>
            📊 Your Progress
          </Text>

          {/* Progress Details */}
          <Layout style={{ marginBottom: 16 }}>
            <Text category="s1" style={{ fontWeight: 'bold', marginBottom: 8 }}>
              🌍 Language:
            </Text>
            <Text category="s1">{progress.currentLanguageName || 'No language selected'}</Text>
          </Layout>

          <Layout style={{ marginBottom: 16 }}>
            <Text category="s1" style={{ fontWeight: 'bold', marginBottom: 8 }}>
              🔥 Streak:
            </Text>
            <Text category="s1">{progress.streak} days</Text>
          </Layout>

          <Layout style={{ marginBottom: 16 }}>
            <Text category="s1" style={{ fontWeight: 'bold', marginBottom: 8 }}>
              🏅 Badges:
            </Text>
            <Text category="s1">
              {progress.badges?.length > 0 ? progress.badges.join(', ') : 'No badges yet'}
            </Text>
          </Layout>

          {/* Close Button */}
          <Button appearance="ghost" onPress={toggleProgressModal}>
            Close
          </Button>
        </Layout>
      </Modal>
    </Layout>
  );
}
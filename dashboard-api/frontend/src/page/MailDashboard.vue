<template>
  <div class="mail-dashboard rounded-t-[15px] w-full h-full overflow-hidden"
       :class="[isDarkMode ? 'bg-dark-card' : 'bg-light-card', 'border-dark-border']">
    <!-- Message d'authentification -->
    <div v-if="!isAuthenticated" class="flex flex-col items-center justify-center h-full">
      <p class="text-xl mb-4" :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
        Vous devez vous connecter à Gmail pour accéder à vos emails
      </p>
      <button @click="loginToGmail" 
              class="px-4 py-2 rounded text-white"
              :class="[isDarkMode ? 'bg-dark-accent' : 'bg-light-accent']">
        Se connecter à Gmail
      </button>
    </div>
    

    <!-- Interface des mails -->
    <div v-else class="h-full flex flex-col mb-6">
      <div class="flex justify-between items-center border-b-2 p-3" 
           :class="[isDarkMode ? 'border-dark-border' : 'border-light-border']">
        <h1 class="text-2xl font-thin"
            :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
          Emails
        </h1>
        <button @click="showNewMailModal = true" class="px-3 py-1 rounded text-white"
                :class="[isDarkMode ? 'bg-dark-accent' : 'bg-light-accent']">
          +
        </button>
      </div>

      <!-- Modal Nouveau Mail -->
      <div v-if="showNewMailModal" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto"
             :class="[isDarkMode ? 'bg-dark-card' : 'bg-light-card']">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold" :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
              Nouveau Message
            </h3>
            <button @click="showNewMailModal = false" class="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
          
          <form @submit.prevent="sendNewMail" class="space-y-4">
              <div>
                  <input type="email" 
                        v-model="newMail.to" 
                        placeholder="À :"
                        class="w-full p-2 rounded border"
                        :class="[isDarkMode ? 'bg-dark-card border-dark-border text-dark-text-primary' : 'bg-white border-gray-300']"
                        required>
              </div>
              
                <div>
                  <input type="text" 
                        v-model="newMail.subject" 
                        placeholder="Objet :"
                        class="w-full p-2 rounded border"
                        :class="[isDarkMode ? 'bg-dark-card border-dark-border text-dark-text-primary' : 'bg-white border-gray-300']"
                        required>
              </div>
              
                <div>
                  <textarea v-model="newMail.content" 
                            placeholder="Contenu du message..."
                            rows="10"
                            class="w-full p-2 rounded border"
                            :class="[isDarkMode ? 'bg-dark-card border-dark-border text-dark-text-primary' : 'bg-white border-gray-300']"
                            required></textarea>
                </div>
              
              <div class="flex justify-end gap-2">
                <button type="button" 
                        @click="showNewMailModal = false"
                        class="px-4 py-2 rounded border"
                        :class="[isDarkMode ? 'border-dark-border text-dark-text-primary' : 'border-gray-300']">
                  Annuler
                </button>
                <button type="submit" 
                        class="px-4 py-2 rounded text-white"
                        :class="[isDarkMode ? 'bg-dark-accent' : 'bg-light-accent']"
                        :disabled="sending">
                  {{ sending ? 'Envoi...' : 'Envoyer' }}
                </button>
              </div>
            </form>
          </div>
      </div>

      <!-- Modal Confirmation Suppression -->
      <div v-if="showDeleteModal" 
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6"
             :class="[isDarkMode ? 'bg-dark-card' : 'bg-light-card']">
          <h3 class="text-xl font-bold mb-4" :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
            Confirmer la suppression
          </h3>
          <p class="mb-6" :class="[isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary']">
            Êtes-vous sûr de vouloir supprimer ce mail ?
          </p>
          <div class="flex justify-end gap-2">
            <button @click="showDeleteModal = false"
                    class="px-4 py-2 rounded border"
                    :class="[isDarkMode ? 'border-dark-border text-dark-text-primary' : 'border-gray-300']">
              Annuler
            </button>
            <button @click="deleteSelectedMail"
                    class="px-4 py-2 rounded bg-red-500 text-white hover:bg-opacity-80">
              Supprimer
            </button>
          </div>
        </div>
      </div>
   
 

      <div class="flex-1 grid grid-cols-[39%_61%]">
        <!-- Liste des emails -->
        <div class="border-r-2" :class="[isDarkMode ? 'border-dark-border' : 'border-light-border']">
          <!-- Onglets -->
          <ul class="flex gap-4 p-4" :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
            <li class="cursor-pointer px-3 py-1 rounded"
                :class="[activeTab === 'all' ? 'bg-dark-accent text-white' : '']"
                @click="setActiveTab('all')">
              Tous
            </li>
            <li class="cursor-pointer px-3 py-1 rounded"
                :class="[activeTab === 'unread' ? 'bg-dark-accent text-white' : '']"
                @click="setActiveTab('unread')">
              Non lus
            </li>
            <li class="cursor-pointer px-3 py-1 rounded"
                :class="[activeTab === 'archived' ? 'bg-dark-accent text-white' : '']"
                @click="setActiveTab('archived')">
              Archives
            </li>
          </ul>

          <!-- Liste des emails -->
          <div class="overflow-y-auto h-[calc(100vh-200px)]">
            <div v-if="loading" class="p-4 text-center"
                 :class="[isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary']">
              Chargement...
            </div>
            <div v-else-if="error" class="p-4 text-center text-red-500">
              {{ error }}
            </div>
            <template v-else>
              <div v-if="mails.length === 0" class="p-4 text-center"
                   :class="[isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary']">
                Aucun email
              </div>
              <div v-else class="divide-y"
                   :class="[isDarkMode ? 'divide-dark-border' : 'divide-light-border']">
                <div v-for="mail in mails" 
                     :key="mail.id"
                     @click="selectMail(mail)"
                     class="p-4 cursor-pointer hover:bg-opacity-10 transition-all"
                     :class="[
                       isDarkMode ? 'hover:bg-dark-accent' : 'hover:bg-light-accent',
                       selectedMail?.id === mail.id ? 'bg-dark-accent bg-opacity-20' : ''
                     ]">
                  <div class="font-medium" :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
                    {{ mail.from }}
                  </div>
                  <div class="font-bold mt-1" :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
                    {{ mail.subject || '(Sans sujet)' }}
                  </div>
                  <div class="text-sm mt-1 line-clamp-2" :class="[isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary']">
                    {{ mail.snippet }}
                  </div>
                  <div v-if="mail.attachments?.length" class="text-xs mt-2">
                    📎 {{ mail.attachments.length }} pièce(s) jointe(s)
                  </div>
                </div>
              </div>
            </template>
          </div>
        </div>

        <!-- Détail de l'email -->
        <div class="p-4 h-full">
          <div v-if="selectedMail" class="h-full flex flex-col">
            <div class="mb-4">
              <h2 class="text-xl font-bold" :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
                {{ selectedMail.subject || '(Sans sujet)' }}
              </h2>
              <div class="text-sm mt-2" :class="[isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary']">
                De: {{ selectedMail.from }}
              </div>
            </div>

            <div v-if="selectedMail.attachments?.length" class="mb-4">
              <div class="text-sm font-bold mb-2" :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
                Pièces jointes:
              </div>
              <div class="flex flex-wrap gap-2">
                <button v-for="attachment in selectedMail.attachments"
                        :key="attachment.attachmentId"
                        @click="handleDownload(selectedMail.id, attachment.attachmentId, attachment.filename)"
                        class="flex items-center gap-2 px-3 py-1 rounded text-sm hover:bg-opacity-80"
                        :class="[isDarkMode ? 'bg-dark-accent text-white' : 'bg-light-accent text-white']">
                  <span>📎</span>
                  <span>{{ attachment.filename }}</span>
                  <span class="text-xs">({{ formatSize(attachment.size) }})</span>
                </button>
              </div>
            </div>

            <div class="flex-1 overflow-y-auto prose dark:prose-invert max-w-none"
                 v-html="selectedMail.content">
            </div>
          </div>
          <div v-else class="h-full flex items-center justify-center"
               :class="[isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary']">
            Sélectionnez un email pour le lire
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import * as mailService from '@/services/mail';

const props = defineProps({
  isDarkMode: {
    type: Boolean,
    required: true
  }
});

// État
const showDeleteModal = ref(false);
const selectedMailToDelete = ref(null);
const showNewMailModal = ref(false);
const newMail = ref({ to: '', subject: '', content: '' });
const isAuthenticated = ref(true);
const loading = ref(false);
const error = ref(null);
const mails = ref([]);
const sending = ref(false);
const selectedMail = ref(null);
const activeTab = ref('all');

// Actions
const loginToGmail = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/gmail/auth`;
};

const setActiveTab = async (tab) => {
  activeTab.value = tab;
  await loadMails();
};

const loadMails = async () => {
  loading.value = true;
  error.value = null;
  try {
    switch (activeTab.value) {
      case 'unread':
        mails.value = await mailService.fetchUnreadMails();
        break;
      case 'archived':
        mails.value = await mailService.fetchArchivedMails();
        break;
      default:
        mails.value = await mailService.fetchAllMails();
    }
  } catch (e) {
    error.value = e.message;
    console.error('Erreur lors du chargement des mails:', e);
  } finally {
    loading.value = false;
  }
};

const selectMail = (mail) => {
  selectedMail.value = mail;
};

const handleDownload = async (messageId, attachmentId, filename) => {
  try {
    await mailService.handleAttachmentDownload(messageId, attachmentId, filename);
  } catch (e) {
    console.error('Erreur lors du téléchargement:', e);
    error.value = 'Erreur lors du téléchargement de la pièce jointe';
  }
};

const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// Initialisation
onMounted(loadMails);

// Vérifier l'auth Gmail
const checkAuth = async () => {
  try {
    const status = await mailService.getAuthStatus();
    isAuthenticated.value = !!status.isAuthenticated;
  } catch (e) {
    console.error('Erreur auth status:', e);
    isAuthenticated.value = false;
  }
};

onMounted(checkAuth);

// Envoi d'un nouveau mail
const sendNewMail = async () => {
  sending.value = true;
  try {
    await mailService.sendMail(newMail.value);
    showNewMailModal.value = false;
    // reset
    newMail.value = { to: '', subject: '', content: '' };
    // recharger la boîte
    await loadMails();
  } catch (e) {
    console.error('Erreur envoi mail:', e);
    error.value = 'Erreur lors de l\'envoi du mail';
  } finally {
    sending.value = false;
  }
};
</script>

<style scoped>
.mail-dashboard {
  height: calc(100vh - 64px);
}

:deep(.prose) {
  max-width: none;
}
</style>

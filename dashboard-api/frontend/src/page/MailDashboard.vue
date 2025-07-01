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

    <!-- Interface des mails (visible uniquement si authentifié) -->
    <div v-else>
      <div class="flex justify-between items-center border-b-2" 
           :class="[isDarkMode ? 'border-dark-border' : 'border-light-border']">
        <h1 class="p-3 text-2xl font-thin"
          :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
          Emails
        </h1>
        <button @click="showNewMailModal = true"
                class="mr-4 p-2 rounded-full hover:bg-opacity-80 transition-all"
                :class="[isDarkMode ? 'bg-dark-accent text-white' : 'bg-light-accent text-white']">
          <span class="text-xl">+</span>
        </button>
      </div>

      <main class="grid grid-cols-[39%_61%]">
        <section class="p-2 left-mail border-r-2 border-dark-border"
          :class="[isDarkMode ? '' : 'border-light-border']">
          <ul class="flex flex-row gap-7 p-2 rounded-sm"
            :class="[isDarkMode ? 'text-dark-text-primary bg-dark-card' : 'text-light-text-primary bg-light-card']">
            <li 
             :class="[activeTab === 'All Mail' ? 'bg-dark-accent' : '']"
              @click="activeTab = 'All Mail'">All Mail</li>
            <li 
             :class="[activeTab === 'Unread' ? 'bg-dark-accent' : '']"
              @click="activeTab = 'Unread'">Unread</li>
            <li 
              :class="[activeTab === 'Active' ? 'bg-dark-accent' : '']"
              @click="activeTab = 'Active'">Archive</li>
          </ul>

          <!-- Liste des mails -->
          <div class="mt-4 overflow-y-auto" style="height: calc(100vh - 180px);">
            <div v-if="loading" class="p-4 text-center">
              Chargement des mails...
            </div>
            <div v-else-if="error" class="p-4 text-red-500">
              {{ error }}
            </div>
            <div v-else>
              <ul v-if="mails.length > 0">
                <li v-for="mail in mails" 
                    :key="mail.id" 
                    @click="selectMail(mail)"
                    class="border-b p-2 cursor-pointer transition-all duration-200"
                    :class="[
                      selectedMail?.id === mail.id ? 'bg-dark-accent bg-opacity-20' : '',
                      isDarkMode ? 'hover:bg-dark-accent hover:bg-opacity-10' : 'hover:bg-light-accent hover:bg-opacity-10'
                    ]">
                  <div class="font-bold" :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
                    {{ mail.subject || '(Sans sujet)' }}
                  </div>
                  <div class="text-xs" :class="[isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary']">
                    De : {{ mail.from }}
                  </div>
                  <div class="text-sm mt-1 line-clamp-1" :class="[isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary']">
                    {{ mail.snippet }}
                  </div>
                </li>
              </ul>
              <div v-else class="p-4 text-center" :class="[isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary']">
                Aucun mail à afficher
              </div>
            </div>
          </div>
        </section>

        <!-- Vue détaillée du mail -->
        <section class="right-mail p-4 overflow-y-auto" style="height: calc(100vh - 100px);">
          <div v-if="selectedMail" class="h-full">
            <div class="mb-6">
              <div class="flex justify-between items-center mb-4">
                <h2 class="text-2xl font-bold" :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
                  {{ selectedMail.subject || '(Sans sujet)' }}
                </h2>
                <div class="flex gap-2">
                  <button @click="archiveSelectedMail" 
                          class="p-2 rounded hover:bg-opacity-80 transition-all"
                          :class="[isDarkMode ? 'bg-dark-accent text-white' : 'bg-light-accent text-white']">
                    Archiver
                  </button>
                  <button @click="confirmDelete" 
                          class="p-2 rounded bg-red-500 text-white hover:bg-opacity-80 transition-all">
                    Supprimer
                  </button>
                </div>
              </div>
              <div class="flex flex-col gap-2 mb-6">
                <div :class="[isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary']">
                  <span class="font-medium">De :</span> {{ selectedMail.from }}
                </div>
              </div>
              <div class="border-t pt-4 whitespace-pre-wrap" 
                   :class="[
                     isDarkMode ? 'text-dark-text-primary border-dark-border' : 'text-light-text-primary border-light-border'
                   ]">
                {{ selectedMail.snippet }}
              </div>

              <!-- Section des pièces jointes -->
              <div v-if="selectedMail.payload?.parts" class="mt-6 border-t pt-4"
                   :class="[isDarkMode ? 'border-dark-border' : 'border-light-border']">
                <h3 class="text-lg font-medium mb-3"
                    :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
                  Pièces jointes
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div v-for="part in getAttachments(selectedMail.payload.parts)" 
                       :key="part.body.attachmentId"
                       class="border rounded p-3 flex items-center justify-between"
                       :class="[isDarkMode ? 'border-dark-border' : 'border-light-border']">
                    <div class="flex items-center space-x-2">
                      <!-- Aperçu pour les images -->
                      <div v-if="isImage(part.mimeType)" class="w-12 h-12">
                        <img :src="getImageUrl(selectedMail.id, part.body.attachmentId)" 
                             :alt="part.filename"
                             class="w-full h-full object-cover rounded">
                      </div>
                      <!-- Icône pour les autres types de fichiers -->
                      <div v-else class="w-12 h-12 flex items-center justify-center bg-gray-100 rounded">
                        <span class="text-2xl">📎</span>
                      </div>
                      <span class="text-sm truncate max-w-[150px]"
                            :class="[isDarkMode ? 'text-dark-text-primary' : 'text-light-text-primary']">
                        {{ part.filename }}
                      </span>
                    </div>
                    <button @click="downloadFile(selectedMail.id, part.body.attachmentId, part.filename)"
                            class="px-3 py-1 rounded text-sm"
                            :class="[isDarkMode ? 'bg-dark-accent text-white' : 'bg-light-accent text-white']">
                      Télécharger
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="h-full flex items-center justify-center">
            <p class="text-center" :class="[isDarkMode ? 'text-dark-text-secondary' : 'text-light-text-secondary']">
              Sélectionnez un mail pour voir son contenu
            </p>
          </div>
        </section>
      </main>

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
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { 
  fetchAllMails, 
  fetchUnreadMails, 
  fetchArchivedMails,
  sendMail,
  archiveMail,
  deleteMail,
  getImageUrl,
  downloadAttachment
} from '@/services/gmail.js';
import apiClient from '@/services/axios-config.js';

const props = defineProps({
    isDarkMode : {
        type: Boolean,
        required: true
    }
});

const isAuthenticated = ref(false);
const activeTab = ref('All Mail');
const mails = ref([]);
const loading = ref(false);
const error = ref(null);
const selectedMail = ref(null);
const showNewMailModal = ref(false);
const showDeleteModal = ref(false);
const sending = ref(false);

const newMail = ref({
  to: '',
  subject: '',
  content: ''
});

// Vérifier l'état de l'authentification
async function checkAuthStatus() {
  try {
    const response = await apiClient.get('/api/gmail/status');
    isAuthenticated.value = response.data.isAuthenticated;
  } catch (error) {
    console.error('Erreur lors de la vérification de l\'authentification:', error);
    isAuthenticated.value = false;
  }
}

// Rediriger vers la page de connexion Gmail
function loginToGmail() {
  window.location.href = `${apiClient.defaults.baseURL}/gmail/auth`;
}

// Vérifier les paramètres d'URL pour l'authentification
function checkAuthParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const authStatus = urlParams.get('auth');
  
  if (authStatus === 'success') {
    isAuthenticated.value = true;
    // Nettoyer l'URL
    window.history.replaceState({}, document.title, window.location.pathname);
    // Charger les mails immédiatement
    loadMails();
  } else if (authStatus === 'error') {
    const errorMessage = urlParams.get('error');
    error.value = `Erreur d'authentification: ${errorMessage || 'Une erreur est survenue'}`;
    isAuthenticated.value = false;
  }
}

async function loadMails() {
  if (!isAuthenticated.value) return;
  
  loading.value = true;
  error.value = null;
  selectedMail.value = null;
  try {
    if (activeTab.value === 'All Mail') {
      mails.value = await fetchAllMails();
    } else if (activeTab.value === 'Unread') {
      mails.value = await fetchUnreadMails();
    } else if (activeTab.value === 'Active') {
      mails.value = await fetchArchivedMails();
    }
  } catch (e) {
    error.value = "Erreur lors du chargement des mails.";
    console.error(e);
    if (e.response?.status === 401) {
      isAuthenticated.value = false;
    }
  } finally {
    loading.value = false;
  }
}

function selectMail(mail) {
  selectedMail.value = mail;
}

async function sendNewMail() {
  sending.value = true;
  try {
    await sendMail(newMail.value);
    showNewMailModal.value = false;
    newMail.value = { to: '', subject: '', content: '' };
    await loadMails(); // Recharger la liste des mails
  } catch (e) {
    error.value = "Erreur lors de l'envoi du mail.";
    console.error(e);
  } finally {
    sending.value = false;
  }
}

async function archiveSelectedMail() {
  if (!selectedMail.value) return;
  try {
    await archiveMail(selectedMail.value.id);
    await loadMails();
    selectedMail.value = null;
  } catch (e) {
    error.value = "Erreur lors de l'archivage du mail.";
    console.error(e);
  }
}

function confirmDelete() {
  showDeleteModal.value = true;
}

async function deleteSelectedMail() {
  if (!selectedMail.value) return;
  try {
    await deleteMail(selectedMail.value.id);
    showDeleteModal.value = false;
    await loadMails();
    selectedMail.value = null;
  } catch (e) {
    error.value = "Erreur lors de la suppression du mail.";
    console.error(e);
  }
}

function getAttachments(parts) {
  if (!parts) return [];
  return parts.filter(part => part.filename && part.body.attachmentId);
}

function isImage(mimeType) {
  return mimeType?.startsWith('image/');
}

async function downloadFile(messageId, attachmentId, filename) {
  try {
    const blob = await downloadAttachment(messageId, attachmentId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (e) {
    error.value = "Erreur lors du téléchargement du fichier.";
    console.error(e);
  }
}

onMounted(async () => {
  checkAuthParams();
  if (!isAuthenticated.value) {
    await checkAuthStatus();
  }
});

watch(activeTab, loadMails);
</script>

<style scoped>
ul > li {
    padding: 0 2px;
    cursor: pointer;
}

/* Personnalisation de la scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  @apply bg-opacity-30;
  background-color: var(--color-dark-accent);
  border-radius: 2px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  @apply bg-opacity-50;
}

/* Animation de transition */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
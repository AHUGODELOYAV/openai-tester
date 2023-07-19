import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonImg,
  IonItem,
  IonLoading,
  IonRow,
  IonTextarea,
} from "@ionic/react";
import "./ExploreContainer.css";
import { Configuration, OpenAIApi } from "openai";
import { useState } from "react";
import axios from "axios";

const OPENAI_API_KEY = "sk-put-your-own-key";
const OPENAI_ORGANIZATION_KEY = "org-put-your-own-org-key";

const ExploreContainer: React.FC = () => {
  const [chatGPTAnswer, setChatGPTAnswer] = useState<
    string | undefined | null
  >();
  const [dalleAnswer, setDalleAnswer] = useState("");
  const [prompt, setPrompt] = useState<string | undefined | null>();
  const [loading, setLoading] = useState(false);

  const configuration = new Configuration({
    organization: OPENAI_ORGANIZATION_KEY,
    apiKey: OPENAI_API_KEY,
  });
  delete configuration.baseOptions.headers["User-Agent"];
  const openai = new OpenAIApi(configuration);

  const sendToChatGPT = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages: [{ role: "user", content: prompt }],
          model: "gpt-3.5-turbo",
          max_tokens: 2048,
          temperature: 0.3,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
      console.log("response", response.data.choices[0].message.content);
      setChatGPTAnswer(response.data.choices[0].message.content);
      setLoading(false);
    } catch (e) {
      setChatGPTAnswer("Something is going wrong, Please try again.");
      setLoading(false);
    }
  };

  const sendToDALLE = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          prompt: prompt,
          n: 1,
          size: "1024x1024",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
      console.log("response", response.data.data[0].url);
      setDalleAnswer(response.data.data[0].url);
      setLoading(false);
    } catch (e) {
      setDalleAnswer("Something is going wrong, Please try again.");
      setLoading(false);
    }
  };

  return (
    <IonContent>
      <IonLoading
        isOpen={loading}
        message="Loading..."
        duration={3000}
        spinner="circles"
      />
      <IonGrid fixed>
        <IonRow>
          <IonCol>
            <IonItem>
              <IonTextarea
                label="Prompt"
                labelPlacement="floating"
                placeholder="Enter text"
                autoGrow
                value={prompt}
                onIonInput={(e) => setPrompt(e.target.value)}
              ></IonTextarea>
            </IonItem>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonButton
              shape="round"
              color="success"
              onClick={() => sendToChatGPT()}
            >
              Send to ChatGPT
            </IonButton>
          </IonCol>
          <IonCol>
            <IonButton
              shape="round"
              color="tertiary"
              onClick={() => sendToDALLE()}
            >
              Send to DALL-E
            </IonButton>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle color="success">ChatGPT</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>{chatGPTAnswer}</IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle color="tertiary">DALL-E</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {dalleAnswer && <IonImg src={dalleAnswer} />}
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default ExploreContainer;

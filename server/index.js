const express = require('express');
const app = express();
const axios = require('axios');
const cors = require('cors');
const authRoutes = require('./routes.js');
const dotenv = require('dotenv');
const { newUser, findUsers, findOneUser } = require("./data/user.js");
const { createDeck, getUserDecks, getDeckById, updateDeck, deleteDeck } = require("./data/decks.js");
const { getCollection } = require("./data/db.js");
const { ObjectId } = require('mongodb');
const { getStatsForUser } = require('./data/stats.js');

const corsOptions = {
  origin: '*', //access-control-allow-credentials:true
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}

app.use(express.json({limit: '50mb'}));
app.use(cors());

app.use("/api", (req, res, next) => {
        console.log("PEDIDO!")
        next()
})

const signupRouter = require('./auth/signup.js');
app.use("/api/signup", signupRouter);

dotenv.config();
app.use('/api', authRoutes);

app.get("/api/ping", (req, res) => {
        return res.status(200).json({response: "PONG"})
})

// Criação de array de tokens
const tokensArr = []

// Aceitar formato JSON
app.use(express.json());


const errors = {
  message: "Os dados introduzidos não são válidos",
  errors: {
    email: "O endereço introduzido já está registado.",
    passwordConfirmation: "As passwords não coincidem.",
    empty: "É obrigatório o preenchimento de todos os campos."
  }
}

// POST do registo com condições de verificação
app.post('/api/signup', async (req, res) => {
  const { email, password, passwordConfirmation } = req.body; // O que receber do body será a informação POST

  // confirmação se email já existe
  const takenEmail = await findOneUser({ email })
  if (takenEmail && email === takenEmail.email) {
    return res.status(400).json({ "message": errors.message, "error": errors.errors.email })
  }

  // confirmação se não há campos vazios
  if (email === "" || password === "" || passwordConfirmation === "") {
    return res.status(400).json({ "message": errors.message, "error": errors.errors.empty })
  }

  // confirmação se passwords estão iguais
  if (password !== passwordConfirmation) {
    return res.status(400).json({ "message": errors.message, "error": errors.errors.passwordConfirmation })
  }

  // se passar todas as confirmações, executa a função
  const id = await newUser(req.body);

  return res.status(201).json({
    "message": "Utilizador criado com sucesso!",
    "_id": id
  })
})


app.post('/api/login', async (req, res) => {
  const { username, password } = req.body

  const takenUserName = await findOneUser({ username })
  if (!takenUserName) {
    return res.status(404).json({ "message": "O utilizador não foi encontrado!" })
  }

  if (takenUserName.password !== password) {
    return res.status(401).json({ "message": "A password introduzida é inválida!" })
  }

  // Falta esta parte
  tokensArr.push(takenUserName._id)

  return res.status(200).json({
    "_id": takenUserName._id
  })

})
console.log(tokensArr)

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OPENAI_API_KEY environment variable not set' });
  }

  try {
    const reply = await axios.post("https://api.openai.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "Você é um assistente de IA especializado em Magic: The Gathering. Ajude o jogador a aprender as regras, cartas, formatos, estratégias, lore do jogo e tudo o que for preciso."
        },
        {
          role: "user",
          content: message
        }
      ], temperature: 0.7
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    res.json({
      reply: reply.data.choices[0].message.content
    });
  } catch (error) {
    console.error('Erro ao chamar a API OpenAI:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Erro ao processar a solicitação' });
  }
});


app.get('/api/card', async (req, res) => {
  const cardName = req.query.name;
  try {
    const response = await axios.get(`https://api.scryfall.com/cards/named?fuzzy=${cardName}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Carta não encontrada ou erro na API Scryfall' });
  }
});

app.get('/api/cards', async (req, res) => {
  const cardName = req.query.name;
  if (!cardName) {
    return res.status(400).json({ error: 'Parâmetro "name" é obrigatório' });
  }

  try {
    const response = await axios.get(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(cardName)}`);
    res.json(response.data.data); // apenas o array de cartas
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar cartas na API Scryfall' });
  }
});

app.get('/api/cards/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const response = await axios.get(`https://api.scryfall.com/cards/${id}`);
    res.json(response.data);
  } catch (error) {
    let msg = 'Card not found or API error.';
    if (error.response && error.response.status === 404) {
      msg = 'Card not found.';
      res.status(404).json({ error: msg });
    } else {
      res.status(500).json({ error: msg });
    }
  }
});

// Criar deck
app.post('/api/decks', async (req, res) => {
  try {
    const id = await createDeck(req.body);
    res.status(201).json({ message: "Deck criado com sucesso!", _id: id });
  } catch (err) {
    res.status(500).json({ error: "Erro ao criar deck" });
  }
});

// Listar decks de um usuário
app.get('/api/decks', async (req, res) => {
  const { user } = req.query;
  if (!user) return res.status(400).json({ error: "Usuário não informado" });
  try {
    const decks = await getUserDecks(user);
    console.log("Decks do usuário:", decks);
    res.json(decks);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar decks" });
  }
});

// Editar deck
app.put('/api/decks/:id', async (req, res) => {
  try {
    const collection = await getCollection("decks");
    const { id } = req.params;
    const { cards, ...rest } = req.body;
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...rest, cards } }
    );
    res.json({ message: "Deck atualizado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao atualizar deck" });
  }
});

app.delete('/api/decks/:id', async (req, res) => {
  try {
    await deleteDeck(req.params.id);
    res.json({ message: "Deck deletado com sucesso!" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao deletar deck" });
  }
});

// Adicionar endpoint para buscar um deck por ID
app.get('/api/decks/:id', async (req, res) => {
  try {
    const deck = await getDeckById(req.params.id);
    if (!deck) return res.status(404).json({ error: 'Deck não encontrado' });
    res.json(deck);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar deck' });
  }
});



// NOVO: endpoint que devolve **todas** as cartas de todos os decks de um utilizador
app.get('/api/user-cards', async (req, res) => {
  const { user } = req.query;
  if (!user) {
    return res.status(400).json({ error: 'Missing user' });
  }

  try {
    // Pega os decks do utilizador
    const decks = await getUserDecks(user);
    console.log('Decks do usuário:', decks.length);

    // Separa e achata todos os arrays de cartas
    const allCards = decks.flatMap(deck =>
      Array.isArray(deck.cards) ? deck.cards : []
    );

    console.log('Total de cartas a devolver:', allCards.length);
    return res.json(allCards);

  } catch (err) {
    console.error('Erro no /api/user-cards:', err);
    return res.status(500).json({ error: 'Erro ao buscar cartas do backend' });
  }
});

// Remover carta do usuário
app.delete('/api/user-cards/:username/:cardId', async (req, res) => {
  const { username, cardId } = req.params;
  try {
    const collection = await getCollection("usercards");
    console.log("Tentando remover:", { user: username, _id: cardId });
    await collection.deleteOne({ user: username, _id: new ObjectId(cardId) });
    res.json({ message: "Card removed" });
  } catch (err) {
    res.status(500).json({ error: "Erro ao remover carta" });
  }
});

// Adicionar carta individual ao usercards
app.post('/api/user-cards', async (req, res) => {
  const { user, ...cardData } = req.body;
  if (!user) {
    return res.status(400).json({ error: 'Usuário não informado' });
  }
  try {
    const collection = await getCollection("usercards");
    const result = await collection.insertOne({ user, ...cardData });
    res.status(201).json({ message: "Carta salva!", _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: "Erro ao salvar carta" });
  }
});

// Endpoint temporário para migrar cartas dos decks para usercards
app.post('/api/migrate-usercards', async (req, res) => {
  const { user } = req.body;
  if (!user) {
    return res.status(400).json({ error: 'Usuário não informado' });
  }
  try {
    const decksCollection = await getCollection("decks");
    const usercardsCollection = await getCollection("usercards");
    const decks = await decksCollection.find({ user }).toArray();
    let count = 0;
    for (const deck of decks) {
      if (Array.isArray(deck.cards)) {
        for (const carta of deck.cards) {
          // Evita duplicatas: verifica se já existe carta igual para o usuário
          const exists = await usercardsCollection.findOne({ user, name: carta.name });
          if (!exists) {
            await usercardsCollection.insertOne({ user, ...carta });
            count++;
          }
        }
      }
    }
    res.json({ message: `Migração concluída! ${count} cartas migradas para usercards.` });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao migrar cartas' });
  }
});

app.get('/api/user-stats', async (req, res) => {
  const { user } = req.query;
  console.log("user recebido:", user);
  if (!user) return res.status(400).json({ error: "Usuário não informado" });
  try {
    const stats = await getStatsForUser(user);
    console.log("stats retornado:", stats);
    res.json(stats);
  } catch (err) {
    console.error("Erro ao buscar estatísticas:", err);
    res.status(500).json({ error: "Erro ao buscar estatísticas" });
  }
});


app.listen(process.env.PORT, () => {
  console.log('Server is running on http://localhost:' + process.env.PORT);
})
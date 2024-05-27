import { Actor, CollisionType, Color, Engine, vec, Text, Font } from "excalibur"

// 1 - Criar uma instancia de Engine, que representa o jogo
const game = new Engine({
	width: 800,
	height: 600
})

// 2 - Criar barra do player
const barra = new Actor({
	x: 150,
	y: game.drawHeight - 40,  //altura da tela do game, menos (-) 40 //game.drawHeight = altura completa do game
	width: 200,
	height: 20,
	color: Color.Chartreuse,
	name: "BarraJogador"
})

// Define o tipo de colisão da barra
//ColissionType.Fixed = significa qye ele não irá se "mexer" quando colidir
barra.body.collisionType = CollisionType.Fixed

//Insete a barra Actor - player no game, para adicionar itens no game
game.add(barra)


// 3 - Movimentar a barra de acordo com a posição do mouse
game.input.pointers.primary.on("move", (event) => {
	//Faz a posição x da barra, ser igual a posição do mouse
	barra.pos.x = event.worldPos.x
})

// 4 - Criar o Actor bolinha
const bolinha = new Actor({
	x: 100,
	y: 300,
	radius: 10,
	color: Color.Red
})

bolinha.body.collisionType = CollisionType.Passive

// 5 - Criar movimentação da bolinha
const velocidadeBolinha = vec(1000, 1000)


// Após 1 segundo (1000 ms), define a velocidade da bolinha em x = 100 e y = 100
setTimeout(() => {
	bolinha.vel = velocidadeBolinha
}, 1000)

// 6 - Fazer a bolinha rebater e ter colisão na parede
bolinha.on("postupdate", () => {
	//Se a bolinha colidir com o lado esquerdo
	if (bolinha.pos.x < bolinha.width / 2) {
		bolinha.vel.x = velocidadeBolinha.x
	}

	//Se a bolinha colidir com o lado direito
	if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
		bolinha.vel.x = velocidadeBolinha.x * -1 //	Um outro jeito mais facil de ser feito é "bolinha.vel.x = -velocidadeBolinha.x"
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	//Se a bolinha colidir com a parte superior
	if (bolinha.pos.y < bolinha.height / 2) {
		bolinha.vel.y = velocidadeBolinha.y
	}

	//Se a bolinha colidir com a parte inferior
	// if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
	// 	bolinha.vel.y = velocidadeBolinha.y * -1 
	// }
})

//Inserir bolinha no game
game.add(bolinha)

// 7 - Criar os blocos 
// Configurações de tamanho e espaçamento dos blocos
const padding = 20;

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Red, Color.Orange, Color.Yellow]

// const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
const larguraBloco = 136
const alturaBloco = 30

const listaBlocos: Actor[] = []


// 8 - Renderização dos bloquinhos

// Renderiza 3 linhas
for (let j = 0; j < linhas; j++) {

	//Renderiza 5 bloquinhos
	for (let i = 0; i < colunas; i++) {
		listaBlocos.push(
			new Actor({
				x: xoffset + i * (larguraBloco + padding) + padding,
				y: yoffset + j * (alturaBloco + padding) + padding,
				width: larguraBloco,
				height: alturaBloco,
				color: corBloco[j]
			})
		)
	}
}


listaBlocos.forEach(bloco => {
	//Define o tipo de colisor de cada bloco
	bloco.body.collisionType = CollisionType.Active

	//Adicionar cada bloco no game
	game.add(bloco)
})

// Adicionando pontuação

let pontos = 0

const textoPontos = new Text({
	text: "OPAA BAOO",
	font: new Font ({ size: 20})
})

const objetoTexto = new Actor({
	x: game.drawWidth - 80,
	y: game.drawHeight - 15
})

objetoTexto.graphics.use(textoPontos)

game.add(objetoTexto)

let colidindo: boolean = false

bolinha.on("collisionstart", (event) => {
	//Verificar se a bolinha colidiu com algum bloco destrutivel

	//Se o elemento colidir for um bloco da lista de blocos (destrutivel)
	if (listaBlocos.includes(event.other)) {
		//Destruir o bloco colidido
		event.other.kill()

	}

	//Rebater a bolinha - Que é inverter as direções
	let interseccao = event.contact.mtv.normalize()

	if (!colidindo) {
		colidindo = true

		// interseccao.x e interseccao.y
		// O maior representa o eixo onde houve o contato 
		if (Math.abs(interseccao.x) > Math.abs(interseccao.y)){
			//bolinha.vel.x = -bolinha.vel.x 
			bolinha.vel.x = bolinha.vel.x * -1
		} else {
			//bolinha.vel.y = -bolinha.vel.y
			bolinha.vel.y = bolinha.vel.y * -1
		}
	}
})

bolinha.on("collisionend", () => {
	colidindo = false
})

bolinha.on("exitviewport", () => {
	alert("FIM DE JOGO")
	window.location.reload()
})

// Para iniciar o game/jogo
game.start()
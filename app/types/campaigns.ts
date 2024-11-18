/*

Npcs
:
[]
description
:
"La campaña comenzó con la misión de escoltar herramientas de minería y provisiones para Gundren Rockseeker, quien fue secuestrado junto con Sildar Hallwinter. Los personajes descubrieron que Glasstaff, un mago buscado por algunos miembros del grupo, estaba liderando a los Redbrands, una banda de criminales que asolaba Phandalin. Tras liberar al pueblo de los rufianes, se vieron inmersos en una trama más grande al encontrar a Nezznar, un drow poseído por Lolth, la diosa de las arañas.\n\nLolth, con la ayuda de Glasstaff y Nezznar, planeaba entrar al plano terrenal utilizando el poder de la Forja de los Hechizos. El grupo logró detenerla al destruir el portal con una espada vorpal que Nezznar había forjado para vengarse de la diosa por esclavizar a su pueblo. Durante la batalla final, Isgramor, el oso de Astoria, fue arrastrado por el portal cuando se destruyó. La espada vorpal se rompió y Lolth lanzó una maldición sobre el grupo antes de que lograran salir victoriosos de la Forja. Como recompensa por su heroísmo, el pueblo les otorgó la Mansión Tresendar, la antigua guarida de los Redbrands."
id
:
1
image
:
null
locations
:
(2) [2, 3]
master_notes
:
null
name
:
"Lost Mines of Phandelver"
players
:
(10) [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
quests
:
[]
sessions
:
[10]
status
:
"published"
*/

export type TCampaign = {
  description: string;
  id: string;
  image: string | null;
  locations: string[];
  master_notes: string | null;
  name: string;
  players: string[];
  quests: string[];
  sessions: string[];
  status: string;
};

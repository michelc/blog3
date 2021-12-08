---
date: 2005-09-03 14:32:00
layout: post
redirect_from: "post/2005/09/03/Amelioration-deconnexion"
tags: qc
title: "Amélioration déconnexion"
---

Les cookies de session liés à l'utilisateur n'étaient pas tous immédiatement
supprimés lors de la déconnexion. Par conséquent, le menu affiché ne
correspondait pas aux rôles de l'utilisateur en cours (pendant le laps de temps
où les rôles de l'utilisateur n'étaient pas recontrôlés). Le problème venait de
la façon de boucler sur les différents cookies pour mettre à jour leur date
d'expiration.

Pour plus de sécurité, le cookie mémorisant la liste des rôles d'un
utilisateur est désormais lié au login de l'utilisateur. Cela permet de lancer
des sessions pour différents utilisateurs. Attention, il faut qu'il s'agisse de
nouvelles sessions et pas simplement de nouvelles fenêtres.

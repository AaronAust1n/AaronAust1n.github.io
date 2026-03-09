---
title: "[Original] 'Mine' Is a Luxury"
date: 2026-03-09
description: "From vanishing Kindle libraries to delisted games, from the subscription economy to data lock-in, the concept of 'mine' is dying in the digital world. Open source is the lowest-cost—and possibly the only—way ordinary people can fight back against monopoly."
tags:
  - Digital Ownership
  - Open Source
  - Subscription Economy
  - Data Sovereignty
  - Antitrust
  - Digital Assets
  - Platform Lock-in
  - Valkey
  - Redis
  - DeepSeek
keywords: "Digital Ownership, Open Source, Subscription Economy, Data Sovereignty, Antitrust, Digital Assets, Platform Lock-in, Valkey, Redis, DeepSeek, Digital Asset Management, Data Portability, Open Source Software"

---

# "Mine" Is a Luxury

You spent three thousand yuan buying books on Kindle. One day Amazon shut down its China operations, and your bookshelf went blank. You spent twenty thousand yuan on Steam games. In 2024, Sony's Concord was pulled from shelves eleven days after launch—players who paid $40 were left with nothing. Ubisoft's The Crew shut down its servers after ten years of operation. Every player's save files, vehicles, and race records evaporated overnight.

These aren't hypotheticals. These things actually happened in the past two years.

In September 2024, California passed AB 2426, requiring digital storefronts to add a line next to the "Buy" button: what you're purchasing isn't a product—it's a license. The law didn't grant consumers any new rights. It simply forced companies to tell the truth—you never owned what you "bought."

My claim goes further: in the digital world, the concept of "mine" is dying. And open source is the only card ordinary people have left to play.

---

Start with the numbers. The global subscription economy hit $555.9 billion in 2025, projected to balloon to $1.5 trillion by 2033 at a 13.3% compound annual growth rate. The implication is blunt: more and more transactions that used to be "purchases" are being rewritten as "rentals."

Adobe killed Photoshop's perpetual license in 2013 and went all-in on subscriptions. A decade later, you pay monthly to use the software. The moment you stop paying, you can't even open your own PSD files—the files don't disappear, but the key to open them gets taken away. Microsoft Office followed the same path. Figma, Notion, Canva—nearly every major productivity tool is walking the same road. The content you create with these tools lives on their servers, saved in their formats, governed by their terms.

There's a shift here that's easy to miss: software companies used to sell tools. You bought them, took them home, and the tools were yours. Now software companies sell access. The tools stay in their hands; you're just permitted to use them for a while. This isn't a business model iteration—it's a transfer of ownership. The direction is from your hands to theirs.

The gaming industry pushed this logic to even more absurd extremes. PC Gamer called 2024 "the year gamers really started pushing back against the erosion of their ownership of software they've paid good money for." The Crew's shutdown directly spawned the Stop Killing Games movement, which collected over a million signatures across Europe and drove a European Citizens' Initiative demanding legislation to protect players' access to games they've purchased. A million signatures, just to fight for a right that sounds self-evident: things I paid for shouldn't vanish from my hands.

---

But the loss of ownership doesn't only happen on the consumer side. A quieter, deeper dispossession is happening at the data layer.

Your photos live in iCloud. Your files live in Google Drive. Your chat history lives on WeChat's servers. How much control do you actually have over this data? In theory, it's yours. In practice, have you ever tried migrating all your iCloud photos to a non-Apple platform? The EU's Digital Markets Act (DMA) took full effect in March 2024, forcing Apple to add a "Transfer to Android" feature in the iOS 26 beta—5,000 photos take 25 minutes to transfer, but health data, payment information, and encrypted notes still can't be migrated. An entire legislative apparatus, the full weight of the European Union, was required to pry open a single crack in Apple's ecosystem.

The existence of that crack itself tells you how serious the problem is. Data portability isn't a technical problem—it's a willingness problem. Platforms have the capability to let your data flow freely. They just have no incentive to do so. Your data stays in their ecosystem, and you stay in their ecosystem. Lock-in isn't a bug; it's a feature.

In April 2025, the U.S. Department of Justice won its second antitrust case, with a federal judge ruling that Google constitutes an illegal monopoly in the digital advertising market. The judge's words: Google "harmed Google's publishing customers, the competitive process, and, ultimately, consumers of information on the open web." The DOJ demanded Google divest its ad exchange platform, AdX. This is one of the heaviest weapons the American judicial system can deploy—and even so, between ruling and enforcement lies a long stretch of appeals and negotiations. The law can chase monopoly, but it's always half a step behind.

---

By this point, the logic chain is clear: subscriptions strip you of ownership over tools, platform lock-in strips you of control over data, and antitrust law, while trying, can't keep pace with the speed of monopolistic expansion.

So what about open source?

In March 2024, Redis Labs announced it was switching Redis's open-source license to a more restrictive dual-license model. Within days, the Linux Foundation announced its backing of Valkey—an open-source fork of Redis. AWS, Google Cloud, and Oracle quickly followed with support. A company tried to tighten control over an open-source project; the community forked an alternative within days, and that alternative received broader industry support than the original.

This isn't an isolated case. The entire open-source AI space is running the same playbook. Meta's Llama model family has open weights. DeepSeek released open-source large language models. Together, they form a counterbalance against the closed-model monopoly of OpenAI and Google. By August 2025, open-source AI search engines began challenging Google Search's dominance. The existence of these projects means no single company can fully lock down the entrance to the AI track.

The power of open source isn't that it always wins—it's that it provides an option that cannot be unilaterally shut down. Redis can change its license, but Valkey won't disappear. OpenAI can keep GPT closed-source, but Llama's and DeepSeek's weights are already scattered across hard drives worldwide. This is structural insurance: as long as the code is open, no single entity can monopolize control.

---

But I have to attack my own argument.

Is open source really a weapon for ordinary people? Someone who can't write code, facing Adobe's subscription-only model—can they replace Photoshop with GIMP? Technically yes. In terms of experience, the gap is enormous. The usability problem with open-source software is real—it's often built by engineers for engineers, and the learning curve for ordinary users is a cliff face.

A deeper issue: the sustainability of open-source projects depends on community contributions and corporate sponsorship, and corporate sponsorship itself can reintroduce asymmetries of control. The Linux Foundation backing Valkey is a good thing—but who are the Linux Foundation's primary funders? Google, Microsoft, Huawei—the very tech giants whose monopolies open source is supposed to counter. The open-source community is using giants' money to fight giants' monopolies. That structure is inherently tense.

There's an even sharper challenge: open source fights monopoly, but monopoly's roots are network effects and economies of scale—neither of which disappears just because code is open. Even if WeChat's code were fully open-sourced, you wouldn't switch to an open-source alternative with three users, because your social relationships are in WeChat. Open source addresses technical lock-in, but social lock-in—your relationships, your habits, your sunk costs—it can't touch.

---

These challenges all hold up. But they prove exactly one thing: open source isn't a silver bullet. It's a floor.

A floor means it doesn't guarantee you win, but it guarantees the game doesn't end with only one player left. When Redis changed its license, without the historically open-source codebase, there would be no Valkey. When Google monopolized the ad market, without open-source ad tech stacks, small publishers wouldn't even have bargaining chips. When AI models went closed-source, without Llama and DeepSeek, pricing power for the entire industry would rest entirely in two or three companies' hands.

The value of open source isn't that it provides a better product—it's that it provides an alternative whose mere existence is meaningful. Its existence forces monopolists to exercise restraint—not because they've found their conscience, but because if they push too far, users and developers have somewhere to go. This is the most fundamental principle in market dynamics: as long as an exit option exists, bargaining power never drops to zero.

Back to the opening claim: "mine" is becoming a luxury. This trend won't reverse. The subscription economy's growth curve won't turn around. Platforms won't voluntarily loosen their grip on data. Ownership in the digital world will continue transferring from individuals to platforms. The law is chasing, but slowly. Consumers are protesting, but the cost of protest is high.

In this landscape, open source is the lowest-cost form of resistance, and possibly the only structurally sustainable one. It doesn't require you to lobby legislators in Brussels. It doesn't require you to launch a million-signature citizens' initiative. It doesn't require you to wait for an antitrust lawsuit that might take a decade. It only requires that code is open, licenses are free, and the right to fork is irrevocable.

That sounds like a low bar. But in a world where "mine" is dying, "anyone can copy and modify this code" might be the last—and most powerful—sentence ordinary people have left.

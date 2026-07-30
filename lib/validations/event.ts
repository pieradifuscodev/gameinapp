import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(3, "Il titolo deve contenere almeno 3 caratteri"),
  sport: z.string().min(1, "Seleziona uno sport"),
  dateStart: z.string().refine((val) => {
    const eventDate = new Date(val);
    const nowPlus2Hours = new Date();
    nowPlus2Hours.setHours(nowPlus2Hours.getHours() + 2);
    return eventDate >= nowPlus2Hours;
  }, "L'evento deve essere programmato con almeno 2 ore di preavviso"),
  description: z.string().optional(),
  isPrivate: z.boolean(),
  circleId: z.string().nullable().optional(),
  gymId: z.string().nullable().optional(),
  location: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  maxPlayers: z.number().min(1, "Almeno 1 giocatore").max(30, "Massimo 30 giocatori"),
  price: z.number().nullable().optional(),
  skillLevel: z.string().nullable().optional(),
  genderPreference: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
  if (data.isPrivate && (!data.circleId || data.circleId.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Se l'evento è privato, devi obbligatoriamente selezionare una Cerchia",
      path: ["circleId"],
    });
  }
  
  if ((!data.gymId || data.gymId.trim() === "") && (!data.location || data.location.trim() === "")) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Seleziona una struttura sportiva o inserisci un luogo di incontro",
      path: ["gymId"],
    });
  }
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export class ProfileModel {
  static getProfile() {
    return {
      name: "Kevin Pérez",
      role: "Desarrollador Frontend & UI Specialist",
      status: "Disponible para proyectos",
      title: "Creando Experiencias Digitales de Alto Nivel.",
      subtitle: "Desarrollador Web especializado en la creación de interfaces estéticas, reactivas y de alto rendimiento utilizando Astro, React y Tailwind CSS.",
      imageUrl: "/foto_mia.png",
      email: "kevinperezzz5000@gmail.com",

      location: "Honduras",
      cvUrl: "#",
      stats: [
        { label: "Años de Experiencia", value: "+2" },
        { label: "Proyectos en Producción", value: "12+" },
        { label: "Tecnologías Dominadas", value: "14+" }
      ],
      socials: {
        github: "https://github.com/Kevin848572",
        linkedin: "https://www.linkedin.com/in/kevin-josé-pérez-martínez-4a7bbb23b",
        instagram: "https://www.instagram.com/kevin_perez52?utm_source=qr&igsh=MWJ0aTF1dTZtbGZtaA=="
      }
    };
  }
}

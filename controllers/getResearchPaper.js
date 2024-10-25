import  prisma from '../prismaClient.js';

export const getResearchPapers = async (req, res) => {
    try {
        const papers = await prisma.researchPaper.findMany(); 
        res.status(200).json(papers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching research papers' });
    }
};

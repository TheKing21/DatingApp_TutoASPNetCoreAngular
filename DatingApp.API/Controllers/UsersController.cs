using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using DatingApp.API.Data;
using DatingApp.API.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DatingApp.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IDatingRepository _repo;
        private readonly IMapper _mapper;

        public UsersController(IDatingRepository repo, IMapper mapper)
        {
            _repo = repo;
            this._mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            int currentIdUser = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);

            var users = await _repo.GetUsers(currentIdUser);
            var usersReturn = _mapper.Map<IEnumerable<dtoUserForList>>(users);
            return Ok(usersReturn);
        }

        [HttpGet("{id}", Name = "GetUser")]
        public async Task<ActionResult> GetUser(int id)
        {
            var user = await _repo.GetUser(id);
            var userReturn = _mapper.Map<dtoUserForDetails>(user);
            return Ok(userReturn);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, dtoUserForUpdate dtoUserUpdate)
        {
            if (id != int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value))
                return Unauthorized();

            var userFromRepo = await _repo.GetUser(id);
            _mapper.Map(dtoUserUpdate, userFromRepo);

            if (await _repo.SaveAll())
                return NoContent();

            throw new System.Exception($"Updating user {id} failed on save");
        }
    }
}